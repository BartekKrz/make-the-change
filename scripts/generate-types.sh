#!/bin/bash

# Script de génération automatique des types Supabase
# Usage: npm run types:generate

echo "🔄 Génération des types TypeScript depuis Supabase..."

# Génération des types depuis la base distante
supabase gen types typescript --project-id ebmjxinsyyjwshnynwwu > packages/api/src/types/supabase.ts

if [ $? -eq 0 ]; then
    echo "✅ Types générés avec succès dans packages/api/src/types/supabase.ts"
    echo "📝 N'oubliez pas de redémarrer votre serveur de développement"
else
    echo "❌ Erreur lors de la génération des types"
    exit 1
fi
