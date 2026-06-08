# Web Worker para OpenCascade.js

Para evitar que la manipulación de geometría compleja bloquee la interfaz de usuario en el navegador, debemos aislar la ejecución de `OpenCascade.js` dentro de un **Web Worker**.

A continuación, se detalla la implementación exacta para generar un cubo paramétrico y extraer su malla para que Three.js pueda renderizarlo.

## 1. El archivo del Web Worker (`cadWorker.js`)

Este archivo debe estar en el directorio `public` (o donde tu bundler maneje los workers estáticos).

```javascript
// public/cadWorker.js

// 1. Importar OpenCascade.js (asegúrate de que el archivo wasm esté en el mismo directorio)
importScripts('https://cdn.jsdelivr.net/npm/opencascade.js@0.0.1/dist/opencascade.wasm.js');

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
  // Necesitamos iterar por las caras del shape para sacar los vértices
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
        
        // Simplificación: Para normales exactas se usaría GeomLProp_SLProps, 
        // pero aquí podemos calcular normales por cara o usar valores aproximados para el cubo.
        normals.push(0, 0, 1); // Mock: En un cubo real hay que calcular la normal por cara
      }

      // Extraer índices (triángulos)
      const triangles = triangulation.get().Triangles();
      const numTriangles = triangulation.get().NbTriangles();

      for (let i = 1; i <= numTriangles; i++) {
        const tri = triangles.Value(i);
        const index1 = tri.Value(1);
        const index2 = tri.Value(2);
        const index3 = tri.Value(3);
        
        // OpenCascade usa índices basados en 1, pero WebGL usa índices basados en 0
        // Aseguramos el orden correcto de los vértices (winding order)
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
```

## 2. Integración en Next.js / React (Three.js)

En tu componente de React, instanciarás el Web Worker y usarás `BufferGeometry` de Three.js para renderizar la malla.

```tsx
// src/components/CadViewer.tsx
import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';

export default function CadViewer() {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const workerRef = useRef<Worker | null>(null);

  // Parámetros del cubo
  const [params, setParams] = useState({ width: 10, height: 10, length: 10 });

  useEffect(() => {
    // Inicializar el worker
    workerRef.current = new Worker('/cadWorker.js');

    workerRef.current.onmessage = (e) => {
      const { type, payload, error } = e.data;

      if (type === 'INIT_SUCCESS') {
        // El worker está listo, generamos el primer modelo
        workerRef.current?.postMessage({ type: 'GENERATE_CUBE', payload: params });
      } else if (type === 'MESH_GENERATED') {
        // Convertir los datos crudos a Three.js BufferGeometry
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(payload.vertices, 3));
        geo.setAttribute('normal', new THREE.BufferAttribute(payload.normals, 3));
        geo.setIndex(new THREE.BufferAttribute(payload.indices, 1));
        
        // Recalcular normales adecuadamente para el sombreado suave
        geo.computeVertexNormals();

        setGeometry(geo);
      } else if (type === 'ERROR') {
        console.error('Worker Error:', error);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // Actualizar modelo cuando cambian los parámetros
  const handleUpdate = () => {
    workerRef.current?.postMessage({ type: 'GENERATE_CUBE', payload: params });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ padding: '1rem', background: '#eee' }}>
        <h3>Controles Paramétricos</h3>
        <label>Ancho: 
          <input type="range" min="1" max="50" value={params.width} 
                 onChange={e => setParams({...params, width: Number(e.target.value)})} 
                 onMouseUp={handleUpdate} />
        </label>
        {/* Agrega sliders para Height y Length */}
      </div>

      <Canvas camera={{ position: [50, 50, 50], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1} />
        
        {geometry && (
          <mesh geometry={geometry}>
            <meshStandardMaterial color="#2196F3" wireframe={false} />
          </mesh>
        )}
      </Canvas>
    </div>
  );
}
```

## Resumen del Flujo:
1. React cambia un parámetro (ej. Ancho).
2. React envía `postMessage` al Web Worker.
3. El Worker llama a la API de OpenCascade C++ (compilada en WebAssembly) para recalcular la topología.
4. El Worker extrae los vértices en un `Float32Array`.
5. El Worker usa `postMessage` con objetos *Transferables* hacia React (cero copia en memoria).
6. React recibe el array, actualiza el `BufferGeometry` de Three.js y se renderiza instantáneamente.
