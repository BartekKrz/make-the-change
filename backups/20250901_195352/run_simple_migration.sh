#!/bin/bash

# =====================================================
# MIGRATION SIMPLIFIÉE - SYSTÈME DUAL BILLING
# Make the Change - Système d'Abonnements Innovant
# =====================================================

echo "==============================================="
echo "MIGRATION DUAL BILLING - MAKE THE CHANGE"
echo "==============================================="
echo "Migration simplifiée - Exécution directe"
echo "Début: $(date)"
echo ""

# Vérifier si supabase CLI est installé
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI n'est pas installé."
    echo "Installation: npm install supabase --save-dev"
    echo ""
    echo "Ou utilisez le SQL Editor de Supabase:"
    echo "1. Allez sur https://supabase.com/dashboard/project/[your-project]"
    echo "2. Cliquez sur 'SQL Editor'"
    echo "3. Copiez-collez le contenu de migration_script.sql"
    echo "4. Cliquez sur 'Run'"
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

# Vérifier que le fichier de migration existe
if [ ! -f "migration_script.sql" ]; then
    echo "❌ Fichier migration_script.sql introuvable"
    echo "Le fichier doit être dans le même répertoire"
    exit 1
fi

echo "📄 Fichier de migration trouvé: migration_script.sql"
echo ""

# =====================================================
# EXÉCUTION DE LA MIGRATION
# =====================================================

echo "🚀 EXÉCUTION DE LA MIGRATION"
echo "============================"

echo "📄 Exécution du script de migration complet..."

if supabase db push --file "migration_script.sql"; then
    echo ""
    echo "✅ MIGRATION RÉUSSIE !"
    echo "======================"
    echo "Le système dual billing a été installé avec succès."
    echo ""
    echo "📋 RÉSUMÉ DES CHANGEMENTS:"
    echo "- Types ENUM créés (subscription_plan_type, billing_frequency, etc.)"
    echo "- Tables étendues (subscriptions, monthly_allocations)"
    echo "- Nouvelles tables créées:"
    echo "  * subscription_billing_history (tracking MRR)"
    echo "  * conversion_events (analytics conversions)"
    echo "  * business_metrics (KPIs temps réel)"
    echo "  * points_expiry_schedule (notifications expiration)"
    echo "  * subscription_cohorts (analyse cohortes)"
    echo "- Index de performance ajoutés"
    echo "- Fonctions utilitaires créées (calculate_mrr, calculate_conversion_rate)"
    echo "- Triggers automatiques configurés"
    echo "- Politiques RLS définies (corrigées)"
    echo "- Données de test insérées"
    echo "- Vues analytiques créées"
    echo ""
    echo "🎉 Migration terminée avec succès!"
    echo "Fin: $(date)"

else
    echo ""
    echo "❌ ÉCHEC DE LA MIGRATION"
    echo "========================"
    echo "Une erreur s'est produite lors de l'exécution."
    echo ""
    echo "🔧 SOLUTIONS POSSIBLES:"
    echo "1. Vérifiez les erreurs ci-dessus"
    echo "2. Utilisez le SQL Editor de Supabase:"
    echo "   - Allez sur https://supabase.com/dashboard/project/[your-project]"
    echo "   - Cliquez sur 'SQL Editor'"
    echo "   - Copiez-collez le contenu de migration_script.sql"
    echo "   - Exécutez par sections si nécessaire"
    echo ""
    echo "3. Vérifiez les permissions de votre compte Supabase"
    echo "4. Assurez-vous que les tables existantes correspondent à la structure attendue"
    echo ""
    exit 1
fi

echo ""
echo "==============================================="
echo "MIGRATION TERMINÉE"
echo "==============================================="
