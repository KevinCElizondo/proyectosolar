# Edge Function: Conversión de Imagen a Modelo 3D Texturizado (`upload-to-3d`)

Esta es la implementación recomendada para la Edge Function de Supabase (`upload-to-3d`).
Su propósito es recibir una imagen desde el frontend, generar un modelo 3D básico (un cubo paramétrico o un plano plano) usando `@gltf-transform/core`, aplicarle la imagen como textura, subir el archivo `.glb` resultante a Supabase Storage y finalmente actualizar o crear un registro en la base de datos de modelos del usuario.

## Requisitos previos

Debes instalar las dependencias de `@gltf-transform` en el entorno de Deno de la Edge Function. Deno usa URLs para la importación.

## Código de la Edge Function (`supabase/functions/upload-to-3d/index.ts`)

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Document, NodeIO } from 'https://esm.sh/@gltf-transform/core@3.1.2'
import { makeBox } from './geometry.ts' // Helper para crear geometría de caja (ver abajo)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Manejo de preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Validar autenticación (JWT)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('No authorization header')

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Obtenemos el usuario que hace la petición
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    // 2. Extraer datos del FormData (imagen y parámetros opcionales)
    const formData = await req.formData()
    const imageFile = formData.get('image') as File
    const modelName = formData.get('name') as string || 'Modelo Generado'

    if (!imageFile) throw new Error('No image provided')

    // Leer los bytes de la imagen
    const imageBytes = new Uint8Array(await imageFile.arrayBuffer())
    const mimeType = imageFile.type

    // 3. Crear el modelo GLTF/GLB con gltf-transform
    const doc = new Document()
    const buffer = doc.createBuffer()
    
    // Crear la textura con la imagen subida
    const texture = doc.createTexture('BaseTexture')
      .setMimeType(mimeType)
      .setImage(imageBytes)

    // Crear el material y asignarle la textura
    const material = doc.createMaterial('TexturedMaterial')
      .setBaseColorTexture(texture)
      .setRoughnessFactor(0.8)
      .setMetallicFactor(0.1)

    // Crear la geometría del cubo (helper hipotético que genera un cubo de 1x1x1)
    // En un escenario real, 'makeBox' debe crear el mesh, los primitives, accessors (Position, Normal, UV)
    const mesh = makeBox(doc, buffer, material, 1, 1, 1)
    
    const node = doc.createNode('CubeNode').setMesh(mesh)
    doc.createScene('Scene').addChild(node)

    // 4. Exportar el documento a un archivo GLB binario
    const io = new NodeIO()
    const glbBytes = await io.writeBinary(doc)

    // 5. Subir el archivo GLB a Supabase Storage
    const fileName = `${user.id}/${crypto.randomUUID()}.glb`
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('models_3d')
      .upload(fileName, glbBytes, {
        contentType: 'model/gltf-binary',
        upsert: false
      })

    if (uploadError) throw uploadError

    // Obtener la URL pública (o firmada) del modelo
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('models_3d')
      .getPublicUrl(fileName)

    // 6. Registrar el modelo en la base de datos
    const { data: dbData, error: dbError } = await supabaseAdmin
      .from('models')
      .insert({
        user_id: user.id,
        name: modelName,
        model_url: publicUrl,
        parameters: { generated_from_image: true }
      })
      .select()

    if (dbError) throw dbError

    // 7. Retornar éxito
    return new Response(
      JSON.stringify({ success: true, model: dbData[0] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
```

## Consideraciones

1. **Helper `makeBox`**: `gltf-transform` es una herramienta de bajo nivel. Para generar la geometría procedural de un cubo (vértices, normales, coordenadas UV para la textura), necesitas escribir una función que construya los `Accessors` correspondientes. Alternativamente, puedes cargar un `.glb` preexistente de un cubo ("cubo base") y simplemente buscar el material y reemplazarle la textura, lo cual es mucho más fácil:

```typescript
// Ejemplo de enfoque de sustitución (más fácil)
const io = new NodeIO()
// Cargar el cubo base desde una URL o ruta local
const baseGlbBytes = await fetch('https://tusitio.com/base_cube.glb').then(res => res.arrayBuffer())
const doc = await io.readBinary(new Uint8Array(baseGlbBytes))

const texture = doc.createTexture('UploadedImage')
  .setMimeType(mimeType)
  .setImage(imageBytes)

// Asignar al primer material que encontremos
doc.getRoot().listMaterials()[0].setBaseColorTexture(texture)

const glbBytes = await io.writeBinary(doc)
```

2. **Límites de memoria**: Las Edge Functions de Supabase tienen un límite de memoria (alrededor de 150MB en el plan gratuito). Asegúrate de comprimir las imágenes en el frontend antes de enviarlas y vigila el tamaño de los GLB generados.
