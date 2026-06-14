// public/cadWorker.js

// Importamos la versión alojada en CDN para evitar problemas de empaquetamiento del WASM
// Si usamos la de npm, tendríamos que configurar vite o webpack para servir el .wasm
importScripts('https://cdn.jsdelivr.net/npm/opencascade.js@0.1.0-alpha.1/dist/opencascade.wasm.js');

let oc; // Instancia global de OpenCascade

// 2. Inicializar OpenCascade de forma asíncrona
initOpenCascade().then(async (openCascade) => {
  oc = openCascade;
  postMessage({ type: 'INIT_SUCCESS' });
}).catch((err) => {
  postMessage({ type: 'INIT_ERROR', error: err.toString() });
});

// 3. Escuchar mensajes desde el hilo principal (React/Next.js)
self.onmessage = function (e) {
  const { type, payload } = e.data;

  if (type === 'GENERATE_CUBE') {
    if (!oc) {
      postMessage({ type: 'ERROR', error: 'OpenCascade no está inicializado' });
      return;
    }

    const { width, height, length } = payload;
    
    try {
      // Llamamos a la función que crea la geometría y extrae la malla
      const meshData = generateParametricCube(width, height, length);
      
      // Enviamos los buffers de vértices e índices de vuelta (transferibles para mayor velocidad)
      postMessage({ 
        type: 'MESH_GENERATED', 
        payload: meshData 
      }, [meshData.vertices.buffer, meshData.normals.buffer, meshData.indices.buffer]);
      
    } catch (err) {
      postMessage({ type: 'ERROR', error: err.toString() });
    }
  }
};

// 4. Función para crear el cubo y triangularlo (Mesh)
function generateParametricCube(width, height, length) {
  // a) Crear el sólido (BRepPrimAPI_MakeBox)
  const boxMaker = new oc.BRepPrimAPI_MakeBox(width, height, length);
  const boxShape = boxMaker.Shape();

  // b) Generar la malla triangular (BRepMesh_IncrementalMesh)
  const deflection = 0.1; // Tolerancia de teselación
  new oc.BRepMesh_IncrementalMesh_2(boxShape, deflection, false, 0.5, false);

  // c) Extraer los datos de la malla
  const vertices = [];
  const normals = [];
  const indices = [];
  
  let indexOffset = 0;

  const explorer = new oc.TopExp_Explorer_2(boxShape, oc.TopAbs_ShapeEnum.TopAbs_FACE, oc.TopAbs_ShapeEnum.TopAbs_SHAPE);
  
  while (explorer.More()) {
    const face = oc.TopoDS.Face_1(explorer.Current());
    const location = new oc.TopLoc_Location_1();
    const triangulation = oc.BRep_Tool.Triangulation(face, location, 0);

    if (!triangulation.IsNull()) {
      const nodes = triangulation.get().Nodes();
      const numNodes = triangulation.get().NbNodes();
      
      // Transformación (si la cara tiene alguna traslación/rotación local)
      const trsf = location.Transformation();

      // Extraer vértices y normales
      for (let i = 1; i <= numNodes; i++) {
        let pnt = nodes.Value(i);
        pnt.Transform(trsf); // Aplicar transformación de la cara
        
        vertices.push(pnt.X(), pnt.Y(), pnt.Z());
        normals.push(0, 0, 1); // Simplificación
      }

      // Extraer índices (triángulos)
      const triangles = triangulation.get().Triangles();
      const numTriangles = triangulation.get().NbTriangles();

      for (let i = 1; i <= numTriangles; i++) {
        const tri = triangles.Value(i);
        const index1 = tri.Value(1);
        const index2 = tri.Value(2);
        const index3 = tri.Value(3);
        
        if (face.Orientation_1() === oc.TopAbs_Orientation.TopAbs_REVERSED) {
          indices.push(indexOffset + index1 - 1);
          indices.push(indexOffset + index3 - 1);
          indices.push(indexOffset + index2 - 1);
        } else {
          indices.push(indexOffset + index1 - 1);
          indices.push(indexOffset + index2 - 1);
          indices.push(indexOffset + index3 - 1);
        }
      }
      
      indexOffset += numNodes;
    }
    explorer.Next();
  }

  // Limpiar memoria C++
  boxMaker.delete();
  boxShape.delete();
  explorer.delete();

  // Devolver arreglos tipados para pasar al hilo principal rápidamente
  return {
    vertices: new Float32Array(vertices),
    normals: new Float32Array(normals),
    indices: new Uint32Array(indices)
  };
}
