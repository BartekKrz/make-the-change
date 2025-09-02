#!/usr/bin/env tsx

/**
 * GENERATE BLURHASH - Make the CHANGE
 *
 * Génère les BlurHash pour toutes les images des producers et projects
 * Mise à jour de la base de données avec les placeholders intelligents
 */

import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';
import { encode } from 'blurhash';

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes');
  console.error('Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définies');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Interface pour les statistiques
interface BlurHashStats {
  totalImages: number;
  processedImages: number;
  successfulHashes: number;
  failedHashes: number;
  startTime: Date;
  endTime?: Date;
}

// Fonction principale pour générer BlurHash
async function generateBlurHash(imageUrl: string): Promise<string> {
  try {
    console.log(`🔗 Téléchargement: ${imageUrl}`);

    // Télécharger l'image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log(`📏 Taille: ${(buffer.length / 1024).toFixed(1)}KB`);

    // Redimensionner pour BlurHash (optimisé)
    const { data, info } = await sharp(buffer)
      .resize(32, 32, { fit: 'inside', withoutEnlargement: true })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    console.log(`🎨 Dimensions: ${info.width}x${info.height}`);

    // Générer le BlurHash
    const hash = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 3);

    console.log(`✅ BlurHash généré: ${hash.substring(0, 20)}...`);
    return hash;

  } catch (error) {
    console.error(`❌ Erreur génération BlurHash:`, error);
    return '';
  }
}

// Fonction pour traiter les producers
async function processProducers(stats: BlurHashStats): Promise<void> {
  console.log('\n🏭 TRAITEMENT DES PRODUCERS');

  const { data: producers, error } = await supabase
    .from('producers')
    .select('id, name, logo_url, cover_image, gallery_images')
    .not('logo_url', 'is', null);

  if (error) {
    console.error('❌ Erreur récupération producers:', error);
    return;
  }

  console.log(`📊 ${producers?.length || 0} producers trouvés`);

  for (const producer of producers || []) {
    console.log(`\n👤 Traitement: ${producer.name}`);

    const allImages: string[] = [];
    const imageTypes: string[] = [];

    // Logo
    if (producer.logo_url) {
      allImages.push(producer.logo_url);
      imageTypes.push('logo');
    }

    // Cover
    if (producer.cover_image) {
      allImages.push(producer.cover_image);
      imageTypes.push('cover');
    }

    // Galerie
    if (producer.gallery_images && Array.isArray(producer.gallery_images)) {
      allImages.push(...producer.gallery_images);
      for (let i = 0; i < producer.gallery_images.length; i++) {
        imageTypes.push(`gallery_${i + 1}`);
      }
    }

    console.log(`🖼️  ${allImages.length} images à traiter`);

    const blurHashes: string[] = [];

    for (let i = 0; i < allImages.length; i++) {
      const imageUrl = allImages[i];
      const imageType = imageTypes[i];

      console.log(`  [${i + 1}/${allImages.length}] ${imageType}: ${imageUrl.split('/').pop()}`);

      stats.totalImages++;
      const hash = await generateBlurHash(imageUrl);

      if (hash) {
        blurHashes.push(hash);
        stats.successfulHashes++;
      } else {
        stats.failedHashes++;
      }

      stats.processedImages++;

      // Petit délai pour éviter de surcharger
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Mettre à jour la base de données
    if (blurHashes.length > 0) {
      const { error: updateError } = await supabase
        .from('producers')
        .update({ blur_hashes: blurHashes })
        .eq('id', producer.id);

      if (updateError) {
        console.error(`❌ Erreur mise à jour producer ${producer.name}:`, updateError);
      } else {
        console.log(`✅ ${producer.name}: ${blurHashes.length} BlurHash sauvegardés`);
      }
    }

    // Petit délai entre producers
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Fonction pour traiter les projects
async function processProjects(stats: BlurHashStats): Promise<void> {
  console.log('\n🏗️  TRAITEMENT DES PROJECTS');

  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      hero_image,
      gallery_images,
      producers!inner(name)
    `)
    .not('hero_image', 'is', null);

  if (error) {
    console.error('❌ Erreur récupération projects:', error);
    return;
  }

  console.log(`📊 ${projects?.length || 0} projects trouvés`);

  for (const project of projects || []) {
    console.log(`\n🏗️  Traitement: ${project.name} (${project.producers?.name})`);

    const allImages: string[] = [];
    const imageTypes: string[] = [];

    // Hero image
    if (project.hero_image) {
      allImages.push(project.hero_image);
      imageTypes.push('hero');
    }

    // Galerie
    if (project.gallery_images && Array.isArray(project.gallery_images)) {
      allImages.push(...project.gallery_images);
      for (let i = 0; i < project.gallery_images.length; i++) {
        imageTypes.push(`gallery_${i + 1}`);
      }
    }

    console.log(`🖼️  ${allImages.length} images à traiter`);

    const blurHashes: string[] = [];

    for (let i = 0; i < allImages.length; i++) {
      const imageUrl = allImages[i];
      const imageType = imageTypes[i];

      console.log(`  [${i + 1}/${allImages.length}] ${imageType}: ${imageUrl.split('/').pop()}`);

      stats.totalImages++;
      const hash = await generateBlurHash(imageUrl);

      if (hash) {
        blurHashes.push(hash);
        stats.successfulHashes++;
      } else {
        stats.failedHashes++;
      }

      stats.processedImages++;

      // Petit délai pour éviter de surcharger
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Mettre à jour la base de données
    if (blurHashes.length > 0) {
      const { error: updateError } = await supabase
        .from('projects')
        .update({ blur_hashes: blurHashes })
        .eq('id', project.id);

      if (updateError) {
        console.error(`❌ Erreur mise à jour project ${project.name}:`, updateError);
      } else {
        console.log(`✅ ${project.name}: ${blurHashes.length} BlurHash sauvegardés`);
      }
    }

    // Petit délai entre projects
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// Fonction principale
async function main() {
  console.log('🚀 DÉBUT GÉNÉRATION BLURHASH - Make the CHANGE');
  console.log('================================================');

  const stats: BlurHashStats = {
    totalImages: 0,
    processedImages: 0,
    successfulHashes: 0,
    failedHashes: 0,
    startTime: new Date()
  };

  try {
    // Traiter les producers
    await processProducers(stats);

    // Traiter les projects
    await processProjects(stats);

    // Finaliser les statistiques
    stats.endTime = new Date();
    const duration = stats.endTime.getTime() - stats.startTime.getTime();

    console.log('\n================================================');
    console.log('🎉 GÉNÉRATION BLURHASH TERMINÉE');
    console.log('================================================');
    console.log(`⏱️  Durée: ${(duration / 1000).toFixed(1)}s`);
    console.log(`🖼️  Total images: ${stats.totalImages}`);
    console.log(`✅ Réussites: ${stats.successfulHashes}`);
    console.log(`❌ Échecs: ${stats.failedHashes}`);
    console.log(`📊 Taux succès: ${((stats.successfulHashes / stats.totalImages) * 100).toFixed(1)}%`);

    if (stats.failedHashes > 0) {
      console.log('\n⚠️  Quelques images ont échoué. Vérifiez les logs ci-dessus.');
    }

    console.log('\n🎯 PROCHAINES ÉTAPES:');
    console.log('1. Tester les BlurHash dans l\'interface');
    console.log('2. Vérifier les placeholders lors du loading');
    console.log('3. Mesurer l\'amélioration UX');

  } catch (error) {
    console.error('💥 ERREUR FATALE:', error);
    process.exit(1);
  }
}

// Gestion des signaux d'arrêt
process.on('SIGINT', () => {
  console.log('\n⏹️  Arrêt demandé par l\'utilisateur');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⏹️  Arrêt demandé par le système');
  process.exit(0);
});

// Lancer le script
if (require.main === module) {
  main().catch(console.error);
}

export { generateBlurHash, processProducers, processProjects };
