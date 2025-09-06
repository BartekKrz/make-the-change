#!/usr/bin/env node

// Script pour vérifier l'état actuel des tags dans la base de données
require('dotenv').config({ path: '../apps/web/.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTagsData() {
  console.log('🔍 Vérification de l\'état actuel des tags...\n');

  try {
    // 1. Vérifier la structure de la table products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, tags, is_active')
      .limit(10);

    if (productsError) {
      console.error('❌ Erreur lors de la récupération des produits:', productsError);
      return;
    }

    console.log(`📊 Total produits analysés: ${products.length}`);
    console.log('\n📋 État des tags par produit:');
    console.log('==================================');

    const tagStats = {
      withTags: 0,
      withoutTags: 0,
      totalTags: new Set(),
      tagDistribution: {}
    };

    products.forEach((product, index) => {
      const hasTags = product.tags && product.tags.length > 0;
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Actif: ${product.is_active ? '✅' : '❌'}`);
      console.log(`   Tags: ${hasTags ? product.tags.join(', ') : '❌ Aucun tag'}`);
      console.log('');

      if (hasTags) {
        tagStats.withTags++;
        product.tags.forEach(tag => {
          tagStats.totalTags.add(tag);
          tagStats.tagDistribution[tag] = (tagStats.tagDistribution[tag] || 0) + 1;
        });
      } else {
        tagStats.withoutTags++;
      }
    });

    console.log('\n📈 Statistiques globales:');
    console.log('==========================');
    console.log(`✅ Produits avec tags: ${tagStats.withTags}`);
    console.log(`❌ Produits sans tags: ${tagStats.withoutTags}`);
    console.log(`🏷️  Tags uniques total: ${tagStats.totalTags.size}`);

    if (tagStats.totalTags.size > 0) {
      console.log('\n🏷️  Distribution des tags:');
      console.log('===========================');
      Object.entries(tagStats.tagDistribution)
        .sort(([,a], [,b]) => b - a)
        .forEach(([tag, count]) => {
          console.log(`   "${tag}": ${count} produit(s)`);
        });

      console.log('\n🎯 Tags uniques disponibles:');
      console.log('=============================');
      Array.from(tagStats.totalTags).sort().forEach(tag => {
        console.log(`   - "${tag}"`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

checkTagsData();
