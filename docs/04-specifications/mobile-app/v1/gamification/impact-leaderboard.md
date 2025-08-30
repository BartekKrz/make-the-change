# 🏆 Classement d'Impact (V1)

> **💡 RÉFÉRENCE** : Voir [../../mobile-conventions/03-conventions-patterns.md](../../mobile-conventions/03-conventions-patterns.md) pour les patterns complets d'utilisation des composants Screen et les conventions de hooks.

**📍 VERSION: V1** | **🗓️ TIMELINE: Mois 5-6** | **⭐️ PRIORITÉ: P1 (Important)**

## 🎯 Objectif

Créer un système de classement (leaderboard) qui met en valeur et récompense les utilisateurs en fonction de leur **impact positif sur la biodiversité**, plutôt que sur leur simple contribution financière. Ce système vise à renforcer l'engagement, à encourager une saine émulation autour de la mission, et à fournir une reconnaissance tangible aux membres les plus actifs.

## 📋 Vue d'Ensemble - Le Classement d'Impact

### Philosophie
Le classement ne doit pas être perçu comme une compétition "pay-to-win", mais comme une célébration de l'impact collectif et individuel. Il met en avant la finalité des contributions.

### Critères de Classement - DUAL BILLING INTEGRATION
Le classement principal sera basé sur un **"Score d'Impact"** unifié. Pour la V1, ce score sera calculé à partir des investissements ET abonnements :

**Investissements directs :**
- **Ruche soutenue :** +100 points d'impact
- **Olivier soutenu :** +150 points d'impact
- **Parcelle familiale soutenue :** +300 points d'impact

**NOUVEAU: Abonnements Ambassadeur (bonus annuels) :**
- **Ambassadeur Standard (mensuel) :** +20 points/mois
- **Ambassadeur Premium (mensuel) :** +35 points/mois
- **Ambassadeur Standard (annuel) :** +252 points/an (+36 bonus pour engagement)
- **Ambassadeur Premium (annuel) :** +480 points/an (+60 bonus pour engagement)

**Raison :** Récompenser l'engagement long terme des subscribers annuels avec un bonus d'impact significatif, créant un incentive gamifié pour les abonnements annuels.

Ce système pourra être enrichi en V2 avec des métriques plus fines (CO₂ compensé, etc.).

## 🖼️ Interface Utilisateur

### Écran Principal du Classement
```text
┌─────────────────────────┐
│ [←] Classement         🏆 │
│                         │
│  [Cette Semaine] [Ce Mois] [Toujours] │
│ ┌─────────────────────┐ │
│ │ 🥇 1. Amélie D.      │ │
│ │    12,500 pts impact  │ │
│ │    🌳x5  🐝x10  🌿x20   │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 🥈 2. Marc L.        │ │
│ │    11,800 pts impact  │ │
│ └─────────────────────┘ │
│ ...                     │
│ ┌─────────────────────┐ │
│ │ 🏅 42. Vous          │ │  <-- Position de l'utilisateur mise en avant
│ │    4,500 pts impact   │ │
│ └─────────────────────┘ │
│                         │
│ ••••• Navigation ••••• │
└─────────────────────────┘
```

### Composants UI
- **Tabs de Période :** Filtres pour "Cette Semaine", "Ce Mois", "Depuis le début".
- **Ligne Utilisateur :** Affiche le rang, l'avatar, le pseudo, le score d'impact total, et un résumé visuel de l'impact (icônes 🌳, 🐝, 🌿).
- **Carte Utilisateur Courant :** Une carte toujours visible en bas (ou mise en surbrillance dans la liste) montrant le rang actuel de l'utilisateur, même s'il est hors du top 50.
- **Écran de Confidentialité :** Une modal ou une page dédiée dans les paramètres pour permettre à l'utilisateur de se retirer du classement ou de choisir un pseudonyme.

## 🔒 Confidentialité & Anonymat

C'est un aspect crucial pour respecter les utilisateurs comme Marc ou Amélie.

- **Opt-in/Opt-out :** Le classement est **opt-out**. Les utilisateurs y figurent par défaut mais peuvent s'en retirer à tout moment.
- **Anonymisation :** Une option "Utiliser un pseudonyme" sera disponible. Par défaut, le format sera "Prénom N." (ex: "Claire N.").
- **Données Visibles :** Seuls le pseudo, l'avatar, le score d'impact et les icônes d'impact sont publics. Aucune somme en euros n'est affichée.

## 🔧 Implémentation Technique

### Base de Données
Une vue matérialisée sera créée pour calculer et agréger les scores d'impact de manière performante, sans surcharger la base de données transactionnelle.

```sql
-- Vue pour le classement d'impact - DUAL BILLING INTEGRATION
CREATE MATERIALIZED VIEW user_impact_summary AS
SELECT
    u.id as user_id,
    u.profile ->> 'first_name' as first_name,
    u.profile ->> 'last_name' as last_name,
    u.profile ->> 'avatar_url' as avatar_url,
    COALESCE(
        -- Points des investissements directs
        SUM(
            CASE
                WHEN i.investment_type = 'ruche' THEN 100
                WHEN i.investment_type = 'olivier' THEN 150
                WHEN i.investment_type = 'parcelle_familiale' THEN 300
                ELSE 0
            END
        ) +
        -- NOUVEAU: Points des abonnements avec bonus annuel
        SUM(
            CASE
                WHEN s.tier = 'ambassadeur_standard' AND s.billing_frequency = 'monthly' 
                    THEN EXTRACT(EPOCH FROM (NOW() - s.created_at)) / (30 * 24 * 60 * 60) * 20
                WHEN s.tier = 'ambassadeur_premium' AND s.billing_frequency = 'monthly'
                    THEN EXTRACT(EPOCH FROM (NOW() - s.created_at)) / (30 * 24 * 60 * 60) * 35
                WHEN s.tier = 'ambassadeur_standard' AND s.billing_frequency = 'annual' AND s.status = 'active'
                    THEN 252 * EXTRACT(EPOCH FROM (NOW() - s.created_at)) / (365 * 24 * 60 * 60)
                WHEN s.tier = 'ambassadeur_premium' AND s.billing_frequency = 'annual' AND s.status = 'active'
                    THEN 480 * EXTRACT(EPOCH FROM (NOW() - s.created_at)) / (365 * 24 * 60 * 60)
                ELSE 0
            END
        ), 0) as total_impact_score,
    COUNT(CASE WHEN i.investment_type = 'ruche' THEN 1 END) as ruches_count,
    COUNT(CASE WHEN i.investment_type = 'olivier' THEN 1 END) as oliviers_count,
    COUNT(CASE WHEN i.investment_type = 'parcelle_familiale' THEN 1 END) as parcelles_count,
    -- NOUVEAU: Tracking abonnements pour affichage
    s.tier as subscription_tier,
    s.billing_frequency as billing_frequency
FROM
    users u
LEFT JOIN
    investments i ON u.id = i.user_id AND i.status = 'active'
LEFT JOIN
    subscriptions s ON u.id = s.user_id AND s.status = 'active'
GROUP BY
    u.id, s.tier, s.billing_frequency;

-- Rafraîchissement quotidien via un cron job
-- REFRESH MATERIALIZED VIEW CONCURRENTLY user_impact_summary;
```

### API Endpoint
Un nouvel endpoint tRPC sera créé pour récupérer les données du classement.

```typescript
// Endpoint: leaderboard.get
GET /api/leaderboard
Query Parameters:
- timeframe: 'weekly' | 'monthly' | 'all_time' (default: 'monthly')
- limit: number (default: 50)

Response: {
  leaderboard: [
    {
      rank: number,
      user: {
        id: string,
        name: string, // "Claire N." ou pseudonyme
        avatarUrl?: string
      },
      impactScore: number,
      impactSummary: {
        ruches: number,
        oliviers: number,
        parcelles: number
      },
      // NOUVEAU: Dual billing badges pour gamification
      subscriptionBadge?: {
        tier: 'ambassadeur_standard' | 'ambassadeur_premium',
        billingFrequency: 'monthly' | 'annual',
        badge: '👑' | '💎' | '🏆', // Badges visuels selon tier + frequency
        bonusText?: 'Engagement Annuel' // Pour annual subscribers
      }
    }
  ],
  currentUserRank?: { ... } // Données de l'utilisateur courant avec même structure
}
```

## ✅ Critères de Validation (V1)
- [ ] Le classement est accessible depuis l'onglet Profil ou un nouvel onglet Communauté.
- [ ] Les données sont rafraîchies au minimum toutes les 24 heures.
- [ ] L'utilisateur peut facilement se retirer du classement ou choisir un pseudonyme.
- [ ] Le calcul du score d'impact est précis et correspond aux investissements de l'utilisateur.
- [ ] L'interface est fluide et performante, même avec des milliers d'utilisateurs.
