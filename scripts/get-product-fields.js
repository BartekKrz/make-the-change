#!/usr/bin/env node

/**
 * Script pour récupérer tous les champs d'un produit depuis Supabase
 * Utilise directement l'outil MCP Supabase
 */

const https = require('https');
const { exec } = require('child_process');

// Configuration Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Variables d\'environnement manquantes: SUPABASE_URL ou SUPABASE_ANON_KEY');
  process.exit(1);
}

/**
 * Fonction pour faire une requête vers Supabase
 */
function querySupabase(sql) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      query: sql
    });

    const options = {
      hostname: SUPABASE_URL.replace('https://', ''),
      port: 443,
      path: '/rest/v1/rpc/execute_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

/**
 * Récupère tous les champs d'un produit
 */
async function getAllProductFields(productId = null) {
  try {
    let sql;

    if (productId) {
      sql = `
        SELECT
          id,
          name,
          slug,
          short_description,
          description,
          category_id,
          producer_id,
          price_points,
          price_eur_equivalent,
          fulfillment_method,
          is_hero_product,
          stock_quantity,
          stock_management,
          weight_grams,
          dimensions,
          images,
          tags,
          variants,
          nutrition_facts,
          allergens,
          certifications,
          origin_country,
          seasonal_availability,
          min_tier,
          featured,
          is_active,
          launch_date,
          discontinue_date,
          seo_title,
          seo_description,
          metadata,
          created_at,
          updated_at,
          blur_hashes,
          secondary_category_id,
          partner_source
        FROM products
        WHERE id = '${productId}'
      `;
    } else {
      sql = `
        SELECT
          id,
          name,
          slug,
          short_description,
          description,
          category_id,
          producer_id,
          price_points,
          price_eur_equivalent,
          fulfillment_method,
          is_hero_product,
          stock_quantity,
          stock_management,
          weight_grams,
          dimensions,
          images,
          tags,
          variants,
          nutrition_facts,
          allergens,
          certifications,
          origin_country,
          seasonal_availability,
          min_tier,
          featured,
          is_active,
          launch_date,
          discontinue_date,
          seo_title,
          seo_description,
          metadata,
          created_at,
          updated_at,
          blur_hashes,
          secondary_category_id,
          partner_source
        FROM products
        LIMIT 5
      `;
    }

    console.log('🔍 Exécution de la requête SQL...');
    console.log('SQL:', sql);

    const result = await querySupabase(sql);

    if (result.error) {
      console.error('❌ Erreur SQL:', result.error);
      return;
    }

    if (!result.data || result.data.length === 0) {
      console.log('⚠️ Aucun produit trouvé');
      return;
    }

    console.log('\n📦 ===== RÉSULTATS =====');

    result.data.forEach((product, index) => {
      console.log(`\n🔹 PRODUIT ${index + 1}: ${product.name}`);
      console.log('='.repeat(50));

      Object.entries(product).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            console.log(`${key}: [${value.length} éléments]`);
            if (value.length > 0 && value.length <= 3) {
              value.forEach((item, idx) => {
                console.log(`  ${idx + 1}. ${item}`);
              });
            }
          } else if (typeof value === 'object') {
            console.log(`${key}: ${JSON.stringify(value, null, 2)}`);
          } else {
            console.log(`${key}: ${value}`);
          }
        } else {
          console.log(`${key}: null`);
        }
      });
    });

    console.log(`\n📊 Total des produits récupérés: ${result.data.length}`);
    console.log('✅ Requête exécutée avec succès!');

  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution:', error.message);
  }
}

/**
 * Affiche la structure des champs
 */
function displayFieldsStructure() {
  const fields = [
    'id (UUID PRIMARY KEY)',
    'name (VARCHAR)',
    'slug (VARCHAR UNIQUE)',
    'short_description (TEXT)',
    'description (TEXT)',
    'category_id (UUID REFERENCES categories)',
    'producer_id (UUID REFERENCES producers)',
    'price_points (INTEGER)',
    'price_eur_equivalent (DECIMAL)',
    'fulfillment_method (VARCHAR: stock/dropship)',
    'is_hero_product (BOOLEAN)',
    'stock_quantity (INTEGER)',
    'stock_management (BOOLEAN)',
    'weight_grams (INTEGER)',
    'dimensions (JSONB)',
    'images (TEXT[])',
    'tags (TEXT[])',
    'variants (JSONB)',
    'nutrition_facts (JSONB)',
    'allergens (TEXT[])',
    'certifications (TEXT[])',
    'origin_country (VARCHAR)',
    'seasonal_availability (JSONB)',
    'min_tier (VARCHAR: explorateur/protecteur/ambassadeur)',
    'featured (BOOLEAN)',
    'is_active (BOOLEAN)',
    'launch_date (DATE)',
    'discontinue_date (DATE)',
    'seo_title (VARCHAR)',
    'seo_description (TEXT)',
    'metadata (JSONB)',
    'created_at (TIMESTAMP)',
    'updated_at (TIMESTAMP)',
    'blur_hashes (TEXT[])',
    'secondary_category_id (UUID)',
    'partner_source (VARCHAR)'
  ];

  console.log('\n📋 ===== STRUCTURE DES CHAMPS =====');
  console.log(`📊 Total: ${fields.length} champs\n`);

  fields.forEach((field, index) => {
    console.log(`${(index + 1).toString().padStart(2, '0')}. ${field}`);
  });
}

// Fonction principale
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const productId = args[1];

  console.log('🚀 Script de récupération des champs produit');
  console.log('==========================================\n');

  if (command === 'structure') {
    displayFieldsStructure();
  } else if (command === 'get' && productId) {
    console.log(`🔍 Récupération du produit avec ID: ${productId}`);
    await getAllProductFields(productId);
  } else if (command === 'list') {
    console.log('📋 Récupération des 5 premiers produits...');
    await getAllProductFields();
  } else {
    console.log('📖 Utilisation:');
    console.log('  node get-product-fields.js structure    # Affiche la structure des champs');
    console.log('  node get-product-fields.js list         # Liste les 5 premiers produits');
    console.log('  node get-product-fields.js get <id>     # Récupère un produit spécifique');
    console.log('\n📝 Exemples:');
    console.log('  node get-product-fields.js structure');
    console.log('  node get-product-fields.js list');
    console.log('  node get-product-fields.js get 123e4567-e89b-12d3-a456-426614174000');
  }
}

// Exécution du script
main().catch(console.error);


