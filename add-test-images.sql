-- =====================================================
-- AJOUT D'IMAGES DE TEST - URLs Unsplash Valides
-- Make the CHANGE - Images pour les producers
-- =====================================================

-- IMPORTANT: Ces URLs Unsplash sont testées et fonctionnelles
-- Elles correspondent aux types d'activités des producteurs

-- =====================================================
-- HABEEBEE - Apiculteurs Belges
-- =====================================================

UPDATE producers SET
images = ARRAY[
  -- Logo/Portrait (image principale)
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',

  -- Image de couverture (ruches/activité)
  'https://images.unsplash.com/photo-1558642891-bbe2c6f0353f?w=1200&h=600&fit=crop',

  -- Galerie (3 images complémentaires)
  'https://images.unsplash.com/photo-1564415075617-d8d304f1d6c9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
]
WHERE name LIKE '%HABEEBEE%';

-- =====================================================
-- ILANGA NATURE - Oliviers de Madagascar
-- =====================================================

UPDATE producers SET
images = ARRAY[
  -- Logo/Portrait (image principale)
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face',

  -- Image de couverture (oliviers/paysage)
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&h=600&fit=crop',

  -- Galerie (3 images complémentaires)
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&h=600&fit=crop'
]
WHERE name LIKE '%ILANGA NATURE%';

-- =====================================================
-- PROMIEL - Coopérative Luxembourg
-- =====================================================

UPDATE producers SET
images = ARRAY[
  -- Logo/Portrait (image principale)
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',

  -- Image de couverture (coopérative/équipe)
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',

  -- Galerie (3 images complémentaires)
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop'
]
WHERE name LIKE '%PROMIEL%';

-- =====================================================
-- AJOUT D'IMAGES POUR LES PROJETS AUSSI
-- =====================================================

-- Projet HABEEBEE (Ruche)
UPDATE projects SET
images = ARRAY[
  -- Hero image (ruche principale)
  'https://images.unsplash.com/photo-1558642891-bbe2c6f0353f?w=800&h=600&fit=crop',

  -- Galerie (processus de production)
  'https://images.unsplash.com/photo-1564415075617-d8d304f1d6c9?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop'
]
WHERE producer_id = (SELECT id FROM producers WHERE name LIKE '%HABEEBEE%' LIMIT 1);

-- Projet ILANGA NATURE (Oliviers)
UPDATE projects SET
images = ARRAY[
  -- Hero image (oliviers)
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',

  -- Galerie (récolte et production)
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop'
]
WHERE producer_id = (SELECT id FROM producers WHERE name LIKE '%ILANGA NATURE%' LIMIT 1);

-- =====================================================
-- VÉRIFICATION DES DONNÉES AJOUTÉES
-- =====================================================

-- Vérifier que les images ont été ajoutées
SELECT
  'PRODUCERS' as type,
  name,
  array_length(images, 1) as image_count,
  CASE
    WHEN array_length(images, 1) >= 1 THEN 'Logo OK'
    ELSE 'Logo manquant'
  END as logo_status,
  CASE
    WHEN array_length(images, 1) >= 2 THEN 'Cover OK'
    ELSE 'Cover manquant'
  END as cover_status,
  CASE
    WHEN array_length(images, 1) >= 3 THEN 'Galerie OK'
    ELSE 'Galerie manquante'
  END as gallery_status
FROM producers
ORDER BY name;

-- Vérifier les projets
SELECT
  'PROJECTS' as type,
  p.name as project_name,
  pr.name as producer_name,
  array_length(p.images, 1) as image_count,
  CASE
    WHEN array_length(p.images, 1) >= 1 THEN 'Hero OK'
    ELSE 'Hero manquant'
  END as hero_status,
  CASE
    WHEN array_length(p.images, 1) >= 2 THEN 'Galerie OK'
    ELSE 'Galerie manquante'
  END as gallery_status
FROM projects p
JOIN producers pr ON p.producer_id = pr.id
ORDER BY p.name;

-- =====================================================
-- RELANCER LA MIGRATION APRÈS AJOUT DES IMAGES
-- =====================================================

-- Relancer la migration pour producers
SELECT migrate_producers_structure();

-- Relancer la migration pour projects
SELECT migrate_projects_structure();

-- =====================================================
-- VÉRIFIER LA MIGRATION
-- =====================================================

-- Vérifier la nouvelle structure producers
SELECT
  name,
  logo_url IS NOT NULL as has_logo,
  cover_image IS NOT NULL as has_cover,
  array_length(producers.gallery_images, 1) > 0 as has_gallery,
  array_length(producers.blur_hashes, 1) > 0 as has_blurhash
FROM producers
ORDER BY name;

-- Vérifier la nouvelle structure projects
SELECT
  p.name as project_name,
  pr.name as producer_name,
  p.hero_image IS NOT NULL as has_hero,
  array_length(p.gallery_images, 1) > 0 as has_gallery,
  array_length(p.blur_hashes, 1) > 0 as has_blurhash
FROM projects p
JOIN producers pr ON p.producer_id = pr.id
ORDER BY p.name;

-- =====================================================
-- STATISTIQUES FINALES
-- =====================================================

SELECT
  'Migration Summary' as status,
  NOW() as timestamp,
  (SELECT COUNT(*) FROM producers WHERE logo_url IS NOT NULL) as producers_with_logo,
  (SELECT COUNT(*) FROM producers WHERE cover_image IS NOT NULL) as producers_with_cover,
  (SELECT COUNT(*) FROM producers WHERE array_length(gallery_images, 1) > 0) as producers_with_gallery,
  (SELECT COUNT(*) FROM projects WHERE hero_image IS NOT NULL) as projects_with_hero,
  (SELECT COUNT(*) FROM projects WHERE array_length(gallery_images, 1) > 0) as projects_with_gallery,
  'Ready for BlurHash generation' as next_step;

-- =====================================================
-- NETTOYAGE (optionnel, après validation)
-- =====================================================

-- Supprimer les anciennes données si tout fonctionne
-- UPDATE producers SET images = NULL WHERE logo_url IS NOT NULL;
-- UPDATE projects SET images = NULL WHERE hero_image IS NOT NULL;
