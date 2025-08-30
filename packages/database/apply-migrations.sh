#!/bin/bash

# Script pour appliquer les migrations Make the CHANGE
# Usage: ./apply-migrations.sh

echo "🚀 Application des migrations Make the CHANGE"
echo "============================================="

echo ""
echo "📋 ÉTAPES MANUELLES REQUISES:"
echo ""
echo "1. Allez sur: https://supabase.com/dashboard/project/ebmjxinsyyjwshnynwwu"
echo "2. Cliquez sur 'SQL Editor'"
echo "3. Appliquez les migrations dans l'ordre:"
echo ""

echo "   📄 Migration 001 - Core Tables:"
echo "   Copiez le contenu de: packages/database/migrations/001_create_core_tables.sql"
echo ""

echo "   📄 Migration 002 - E-commerce Tables:"  
echo "   Copiez le contenu de: packages/database/migrations/002_create_ecommerce_tables.sql"
echo ""

echo "   📄 Migration 003 - RLS Policies:"
echo "   Copiez le contenu de: packages/database/migrations/003_create_rls_policies.sql"
echo ""

echo "4. Vérifiez que toutes les tables sont créées et RLS est activé"
echo "5. Revenez ici et lancez: pnpm db:verify"
echo ""

echo "⚠️  IMPORTANT:"
echo "   - Les extensions (uuid-ossp, postgis, pg_trgm) doivent être activées"
echo "   - Les tables doivent être créées dans l'ordre"
echo "   - Vérifiez qu'il n'y a pas d'erreurs dans la console SQL"
echo ""

echo "🔗 Liens utiles:"
echo "   Dashboard: https://supabase.com/dashboard/project/ebmjxinsyyjwshnynwwu"
echo "   SQL Editor: https://supabase.com/dashboard/project/ebmjxinsyyjwshnynwwu/sql"
echo ""
