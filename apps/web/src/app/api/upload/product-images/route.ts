import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Configuration avec service role pour l'upload côté serveur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string

    if (!file || !productId) {
      return NextResponse.json(
        { error: 'File and productId are required' },
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

    // Upload vers Supabase Storage
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = `${productId}/gallery/${fileName}`

    const { data, error } = await supabaseAdmin.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '31536000', // 1 an
        upsert: true
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return NextResponse.json(
        { error: 'Échec de l\'upload' },
        { status: 500 }
      )
    }

    // Générer l'URL publique
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('products')
      .getPublicUrl(filePath)

    const imageUrl = publicUrlData.publicUrl

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

    // Ajouter la nouvelle image à la liste
    const currentImages = product.images || []
    const updatedImages = [...currentImages, imageUrl]

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
      // Si on ne peut pas mettre à jour la DB, on supprime le fichier uploadé
      await supabaseAdmin.storage.from('products').remove([filePath])
      return NextResponse.json(
        { error: 'Échec de la mise à jour du produit' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: imageUrl,
      path: filePath,
      images: updatedImages
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
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
