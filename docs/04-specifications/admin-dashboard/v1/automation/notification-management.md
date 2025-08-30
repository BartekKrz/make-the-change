# 🔔 Gestion des Notifications & Campagnes

**📍 VERSION: V1** | **🗓️ TIMELINE: Mois 5-6** | **⭐️ PRIORITÉ: P1 (Important)**

## 🎯 Objectif

Fournir une suite d'outils complète aux administrateurs pour créer, gérer, automatiser, et analyser les campagnes de notifications (Push, Email, SMS, In-App) afin de maximiser l'engagement, la conversion et la rétention des utilisateurs, en particulier pour le système critique d'expiration des points.

---

## 🖼️ Structure de l'Interface

La gestion des notifications s'articulera autour de quatre écrans principaux dans le dashboard admin :

1.  **Dashboard Analytics** : Vue d'ensemble de la performance.
2.  **Gestion des Templates** : Bibliothèque des messages pré-définis.
3.  **Gestion des Campagnes** : Outil pour créer et suivre les campagnes.
4.  **Moniteur d'Activité** : Journal des envois en temps réel.

---

### 1. Dashboard Analytics

**Objectif** : Visualiser en un coup d'œil la santé et la performance du système de notifications.

```typescript
interface NotificationsAnalyticsDashboard {
  kpis: {
    total_sent_24h: number;
    open_rate_avg: number; // % moyen
    ctr_avg: number; // % moyen
    conversion_rate_avg: number; // % moyen
    opt_out_rate_24h: number; // % d'utilisateurs s'étant désinscrits
  };

  charts: {
    delivery_over_time: ChartData; // Volume envoyé par canal (Push, Email)
    engagement_by_type: ChartData; // Taux d'ouverture par type de notif (expiry, promo)
    conversion_funnel: FunnelData; // Sent -> Delivered -> Opened -> Clicked -> Converted
  };

  tables: {
    top_performing_campaigns: CampaignPerformance[];
    worst_performing_campaigns: CampaignPerformance[];
  };
}
```

### 2. Gestion des Templates

**Objectif** : Permettre aux équipes marketing de créer et modifier facilement le contenu des notifications pour chaque scénario (ex: alerte d'expiration à 60, 30, 7 jours).

```typescript
interface NotificationTemplateEditor {
  template_id: string;
  template_name: string; // Ex: "Points Expiry - 30 Days"
  channels: ('push' | 'email' | 'sms' | 'in_app')[];

  // Éditeur de contenu par canal
  content_editor: {
    push: {
      title: string; // Supporte les variables {firstName}
      body: string;  // Supporte les variables {points_amount}
      image_url?: string;
      deep_link: string;
    };
    email: {
      subject: string;
      preheader: string;
      template_id_provider: string; // ID du template chez SendGrid/Mailgun
      // L'édition du contenu de l'email se fait chez le fournisseur
    };
    sms: {
      message: string; // 160 caractères max, avec compteur
    };
  };

  variablesAvailable: string[]; // Ex: {firstName}, {pointsAmount}, {expiryDate}
  preview_tool: {
    user_segment: UserSegment; // Pour tester avec des données réelles
    preview_data: any;
  };
  version_history: Version[];
}
```

### 3. Gestion des Campagnes

**Objectif** : Créer des campagnes de notifications, qu'elles soient ponctuelles (promo) ou automatisées (workflows).

```typescript
interface CampaignManager {
  campaign_id: string;
  campaign_name: string;
  status: 'draft' | 'active' | 'scheduled' | 'completed' | 'archived';

  trigger: {
    type: 'on_event' | 'scheduled' | 'manual';
    event_name?: string; // Ex: "user_level_upgraded"
    schedule_date?: Date;
  };

  audience: {
    target_segment: UserSegment; // Ex: "Protecteurs avec points expirant dans 30j"
    estimated_size: number;
    exclusion_rules?: UserSegment[];
  };

  messaging: {
    template_id: string;
    ab_test_config?: {
      variants: { template_id: string; percentage: number }[];
      goal_metric: 'open_rate' | 'conversion_rate';
      duration_hours: number;
    };
  };

  performance?: CampaignPerformanceMetrics;
}
```

### 4. Moniteur d'Activité

**Objectif** : Suivre en temps réel les envois, les statuts de livraison et les erreurs pour un débogage rapide.

```typescript
interface ActivityMonitor {
  log_stream: {
    timestamp: Date;
    notification_id: string;
    userId: string;
    channel: 'push' | 'email' | 'sms';
    status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed';
    error_message?: string;
  }[];

  filters: {
    userId?: string;
    campaign_id?: string;
    channel?: string;
    status?: string;
    date_range: DateRange;
  };

  actions: {
    retry_failed: (notification_id: string) => void;
    viewUserProfile: (userId: string) => void;
    view_campaign: (campaign_id: string) => void;
  };
}
```

---

## 🔧 Implémentation Technique

- **Backend** : Le `SmartNotificationEngine` et le `NotificationSchedulingSystem` décrits dans le document de référence seront le moteur de cette interface.
- **Frontend** : Next.js avec shadcn/ui, utilisant des tables de données (TanStack Table), des graphiques (Recharts) et des formulaires (React Hook Form).
- **API** : Les endpoints tRPC `admin.notifications.*` et `admin.automation.*` seront utilisés pour alimenter ces écrans.

---

## ✅ Critères de Validation

- L'admin peut créer un template de notification pour une alerte d'expiration.
- L'admin peut créer une campagne ciblant les utilisateurs dont les points expirent.
- L'admin peut visualiser les statistiques de performance d'une campagne terminée.
- L'admin peut suivre les envois en temps réel et identifier les erreurs de livraison.
