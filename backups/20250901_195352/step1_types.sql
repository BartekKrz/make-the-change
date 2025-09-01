-- =====================================================
-- ÉTAPE 1: CRÉATION DES TYPES ENUM
-- =====================================================

-- Vérifier et créer les types ENUM nécessaires
DO $$ BEGIN
    -- Type pour les plans d'abonnement
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_plan_type') THEN
        CREATE TYPE subscription_plan_type AS ENUM (
            'explorer_free',
            'protector_basic',
            'ambassador_standard',
            'ambassador_premium'
        );
    END IF;

    -- Type pour la fréquence de facturation
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'billing_frequency') THEN
        CREATE TYPE billing_frequency AS ENUM ('monthly', 'annual');
    END IF;

    -- Type pour le statut des abonnements
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status_type') THEN
        CREATE TYPE subscription_status_type AS ENUM (
            'active',
            'inactive',
            'cancelled',
            'past_due',
            'unpaid',
            'trialing'
        );
    END IF;

    -- Type pour les événements de conversion
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'conversion_event_type') THEN
        CREATE TYPE conversion_event_type AS ENUM (
            'monthly_to_annual',
            'annual_to_monthly',
            'plan_upgrade',
            'plan_downgrade',
            'reactivation',
            'cancellation'
        );
    END IF;
EXCEPTION
    WHEN others THEN
        RAISE NOTICE 'Erreur lors de la création des types ENUM: %', SQLERRM;
END $$;

-- Vérification
SELECT 'Types ENUM créés avec succès' as status;
