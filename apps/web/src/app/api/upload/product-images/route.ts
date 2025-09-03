import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Configuration avec service role pour l'upload côté serveur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Support pour upload single ou multiple
    const singleFile = formData.get('file') as File
    const multipleFiles = formData.getAll('files') as File[]
    const productId = formData.get('productId') as string

    // Déterminer si c'est un upload single ou multiple
    const files = singleFile ? [singleFile] : multipleFiles
    
    if (!files.length || !productId) {
      return NextResponse.json(
        { error: 'File(s) and productId are required' },
        { status: 400 }
      )
    }

    console.log(`📸 Processing ${files.length} file(s) for product ${productId}`)

    // Validation des fichiers
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Type de fichier non supporté: ${file.name}` },
          { status: 400 }
        )
      }

      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `Fichier trop volumineux: ${file.name} (max 10MB)` },
          { status: 400 }
        )
      }
    }

    // Récupérer les images actuelles du produit
    const { data: product, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('images')
      .eq('id', productId)
      .single()

    if (fetchError) {
      console.error('Erreur récupération produit:', fetchError)
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    const currentImages = product.images || []
    const newImageUrls: string[] = []
    const uploadedPaths: string[] = []

    // Upload de tous les fichiers
    try {
      for (const file of files) {
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const filePath = `${productId}/gallery/${fileName}`

        console.log(`📤 Uploading ${file.name} to ${filePath}`)

        const { data, error } = await supabaseAdmin.storage
          .from('products')
          .upload(filePath, file, {
            cacheControl: '31536000', // 1 an
            upsert: true
          })

        if (error) {
          console.error('Supabase upload error:', error)
          throw new Error(`Échec de l'upload pour ${file.name}`)
        }

        // Générer l'URL publique
        const { data: publicUrlData } = supabaseAdmin.storage
          .from('products')
          .getPublicUrl(filePath)

        const imageUrl = publicUrlData.publicUrl
        newImageUrls.push(imageUrl)
        uploadedPaths.push(filePath)
        
        console.log(`✅ Successfully uploaded ${file.name}: ${imageUrl}`)
        
        // 🚀 NOUVEAU : Générer blur hash automatiquement après upload
        console.log(`🔄 Génération blur hash pour: ${imageUrl}`)
        try {
          const blurResponse = await fetch(`${supabaseUrl}/functions/v1/generate-blur-hash`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              imageUrl,
              entityType: 'product',
              entityId: productId
            })
          })
          
          if (blurResponse.ok) {
            const blurResult = await blurResponse.json()
            if (blurResult.success) {
              console.log(`✅ Blur hash généré: ${blurResult.blurHash?.slice(0, 20)}...`)
            } else {
              console.warn(`⚠️ Blur generation failed: ${blurResult.error}`)
            }
          } else {
            console.warn(`⚠️ Blur Edge Function error: ${blurResponse.status} ${blurResponse.statusText}`)
          }
        } catch (blurError) {
          console.error(`❌ Blur generation error for ${imageUrl}:`, blurError)
          // Continue with upload even if blur fails
        }
      }

      // Ajouter les nouvelles images à la liste
      const updatedImages = [...currentImages, ...newImageUrls]

      // Mettre à jour le produit avec les nouvelles images
      const { error: updateError } = await supabaseAdmin
        .from('products')
        .update({ 
          images: updatedImages,
          updated_at: new Date().toISOString()
        })
        .eq('id', productId)

      if (updateError) {
        console.error('Erreur mise à jour produit:', updateError)
        // Si on ne peut pas mettre à jour la DB, on supprime les fichiers uploadés
        await supabaseAdmin.storage.from('products').remove(uploadedPaths)
        throw new Error('Échec de la mise à jour du produit')
      }

      console.log(`🎉 Successfully processed ${files.length} file(s)`)

      // Retourner les images mises à jour ET la première URL pour compatibilité
      return NextResponse.json({
        success: true,
        url: newImageUrls[0], // Compatibilité avec l'ancien format
        urls: newImageUrls, // Nouvelles URLs
        images: updatedImages, // Toutes les images du produit
        count: files.length
      })

    } catch (uploadError) {
      // Nettoyer les fichiers partiellement uploadés
      if (uploadedPaths.length > 0) {
        await supabaseAdmin.storage.from('products').remove(uploadedPaths)
      }
      throw uploadError
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Erreur interne du serveur' 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('path')
    const productId = searchParams.get('productId')
    const imageUrl = searchParams.get('imageUrl')

    if (!filePath || !productId || !imageUrl) {
      return NextResponse.json(
        { error: 'File path, productId and imageUrl are required' },
        { status: 400 }
      )
    }

    // Supprimer le fichier du storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('products')
      .remove([filePath])

    if (storageError) {
      console.error('Supabase delete error:', storageError)
      return NextResponse.json(
        { error: 'Échec de la suppression du fichier' },
        { status: 500 }
      )
    }

    // Récupérer les images actuelles du produit
    const { data: product, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('images')
      .eq('id', productId)
      .single()

    if (fetchError) {
      console.error('Erreur récupération produit:', fetchError)
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    // Retirer l'image supprimée de la liste
    const currentImages = product.images || []
    const updatedImages = currentImages.filter((img: string) => img !== imageUrl)

    // Mettre à jour le produit avec les images restantes
    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update({ 
        images: updatedImages,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)

    if (updateError) {
      console.error('Erreur mise à jour produit:', updateError)
      return NextResponse.json(
        { error: 'Échec de la mise à jour du produit' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      images: updatedImages
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string
    const oldImageUrl = formData.get('oldImageUrl') as string
    const imageIndex = parseInt(formData.get('imageIndex') as string)

    if (!file || !productId || !oldImageUrl || isNaN(imageIndex)) {
      return NextResponse.json(
        { error: 'File, productId, oldImageUrl and imageIndex are required' },
        { status: 400 }
      )
    }

    // Validation du fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non supporté' },
        { status: 400 }
      )
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB
      return NextResponse.json(
        { error: 'Fichier trop volumineux (max 10MB)' },
        { status: 400 }
      )
    }

    // Upload du nouveau fichier
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = `${productId}/gallery/${fileName}`

    const { data, error: uploadError } = await supabaseAdmin.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '31536000',
        upsert: true
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json(
        { error: 'Échec de l\'upload' },
        { status: 500 }
      )
    }

    // Générer l'URL publique
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('products')
      .getPublicUrl(filePath)

    const newImageUrl = publicUrlData.publicUrl

    // 🚀 NOUVEAU : Générer blur hash automatiquement après upload de remplacement
    console.log(`🔄 Génération blur hash pour remplacement: ${newImageUrl}`)
    try {
      const blurResponse = await fetch(`${supabaseUrl}/functions/v1/generate-blur-hash`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: newImageUrl,
          entityType: 'product',
          entityId: productId
        })
      })
      
      if (blurResponse.ok) {
        const blurResult = await blurResponse.json()
        if (blurResult.success) {
          console.log(`✅ Blur hash généré pour remplacement: ${blurResult.blurHash?.slice(0, 20)}...`)
        } else {
          console.warn(`⚠️ Blur generation failed pour remplacement: ${blurResult.error}`)
        }
      } else {
        console.warn(`⚠️ Blur Edge Function error pour remplacement: ${blurResponse.status} ${blurResponse.statusText}`)
      }
    } catch (blurError) {
      console.error(`❌ Blur generation error pour remplacement ${newImageUrl}:`, blurError)
      // Continue with replacement even if blur fails
    }

    // Récupérer les images actuelles du produit
    const { data: product, error: fetchError } = await supabaseAdmin
      .from('products')
      .select('images')
      .eq('id', productId)
      .single()

    if (fetchError) {
      console.error('Erreur récupération produit:', fetchError)
      // Supprimer le fichier uploadé si erreur
      await supabaseAdmin.storage.from('products').remove([filePath])
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      )
    }

    // Remplacer l'image à l'index donné
    const currentImages = product.images || []
    const updatedImages = [...currentImages]
    updatedImages[imageIndex] = newImageUrl

    // Mettre à jour le produit
    const { error: updateError } = await supabaseAdmin
      .from('products')
      .update({ 
        images: updatedImages,
        updated_at: new Date().toISOString()
      })
      .eq('id', productId)

    if (updateError) {
      console.error('Erreur mise à jour produit:', updateError)
      // Supprimer le nouveau fichier si erreur
      await supabaseAdmin.storage.from('products').remove([filePath])
      return NextResponse.json(
        { error: 'Échec de la mise à jour du produit' },
        { status: 500 }
      )
    }

    // Supprimer l'ancien fichier du storage (en arrière-plan)
    if (oldImageUrl.includes('supabase.co/storage')) {
      const oldPath = oldImageUrl.split('/storage/v1/object/public/products/')[1]
      if (oldPath) {
        await supabaseAdmin.storage.from('products').remove([oldPath])
      }
    }

    return NextResponse.json({
      success: true,
      url: newImageUrl,
      path: filePath,
      images: updatedImages
    })

  } catch (error) {
    console.error('Replace error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PATCH - Réordonner les images
export async function PATCH(request: NextRequest) {
  try {
    const { productId, images } = await request.json()

    if (!productId || !Array.isArray(images)) {
      return NextResponse.json(
        { error: 'ProductId et array d\'images requis' },
        { status: 400 }
      )
    }

    console.log('🔄 Reordering images for product:', productId)
    console.log('📋 New order:', images)

    // Mettre à jour l'ordre des images dans la base de données
    const { data, error } = await supabaseAdmin
      .from('products')
      .update({ images })
      .eq('id', productId)
      .select('images')
      .single()

    if (error) {
      console.error('🚨 Database update error:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour de l\'ordre' },
        { status: 500 }
      )
    }

    console.log('✅ Images reordered successfully:', data.images)

    return NextResponse.json({
      success: true,
      images: data.images,
      message: 'Ordre des images mis à jour'
    })
  } catch (error) {
    console.error('Reorder error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
