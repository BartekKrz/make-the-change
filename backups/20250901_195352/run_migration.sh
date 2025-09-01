#!/bin/bash

# =====================================================
# SCRIPT DE MIGRATION AUTOMATISÉ
# Make the Change - Système Dual Billing
# =====================================================

echo "==============================================="
echo "MIGRATION DUAL BILLING - MAKE THE CHANGE"
echo "==============================================="
echo "Début: $(date)"
echo ""

# Vérifier si supabase CLI est installé
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI n'est pas installé."
    echo "Installation: npm install supabase --save-dev"
    exit 1
fi

# Vérifier si on est dans un projet supabase
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Pas dans un projet Supabase (config.toml manquant)"
    echo "Allez dans le répertoire racine du projet"
    exit 1
fi

echo "✅ Supabase CLI détecté"
echo "✅ Projet Supabase détecté"
echo ""

# Fonction pour exécuter un fichier SQL
execute_sql() {
    local file="$1"
    local description="$2"

    echo "📄 Exécution: $description"
    echo "Fichier: $file"

    if supabase db push --file "$file"; then
        echo "✅ $description - SUCCÈS"
    else
        echo "❌ $description - ÉCHEC"
        echo "Vérifiez les erreurs ci-dessus"
        read -p "Continuer malgré l'erreur? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    echo ""
}

# =====================================================
# EXÉCUTION DES ÉTAPES
# =====================================================

echo "🚀 DÉBUT DE LA MIGRATION"
echo "=========================="

# Étape 1: Types ENUM
execute_sql "step1_types.sql" "Création des types ENUM"

# Étape 2: Extension des tables existantes
execute_sql "step2_extend_tables.sql" "Extension des tables existantes"

# Étape 3: Nouvelles tables
execute_sql "step3_new_tables.sql" "Création des nouvelles tables"

# Étape 4: Index de performance
execute_sql "step4_indexes.sql" "Création des index"

# Étape 5: Fonctions
execute_sql "step5_remaining.sql" "Création des fonctions"

# Étape 6: Triggers
execute_sql "step5_remaining.sql" "Configuration des triggers"

# Étape 7: Politiques RLS
execute_sql "step5_remaining.sql" "Configuration des politiques RLS"

# Étape 8: Données de test
execute_sql "step5_remaining.sql" "Insertion des données de test"

# Étape 9: Vues
execute_sql "step5_remaining.sql" "Création des vues"

echo "==============================================="
echo "MIGRATION TERMINÉE"
echo "==============================================="
echo "Fin: $(date)"
echo ""
echo "📋 RÉSUMÉ:"
echo "- Types ENUM créés"
echo "- Tables étendues (subscriptions, monthly_allocations)"
echo "- Nouvelles tables créées (billing_history, conversion_events, etc.)"
echo "- Index de performance ajoutés"
echo "- Fonctions utilitaires créées"
echo "- Triggers automatiques configurés"
echo "- Politiques RLS définies"
echo "- Données de test insérées"
echo "- Vues analytiques créées"
echo ""
echo "🎉 Migration terminée avec succès!"
echo "==============================================="
