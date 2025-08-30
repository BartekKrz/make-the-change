# Configuration Feature Flags

## Système de Feature Flags

### Implémentation Technique

```typescript
// packages/feature-flags/src/index.ts
import { createClient } from '@supabase/supabase-js';

export type FeatureFlag =
  | 'gamification'
  | 'social-features'
  | 'advanced-analytics'
  | 'internationalization'
  | 'pwa-offline'
  | 'ai-recommendations'
  | 'ab-testing'
  | 'business-intelligence'
  | 'automation-workflows'
  | 'multi-tenant';

export interface FeatureFlagConfig {
  enabled: boolean;
  description: string;
  rollout_percentage?: number; // Pour activation progressive
  user_whitelist?: string[]; // Utilisateurs spécifiques
}

export class FeatureFlagService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async isEnabled(flag: FeatureFlag, userId?: string): Promise<boolean> {
    try {
      const { data } = await this.supabase
        .from('feature_flags')
        .select('*')
        .eq('flag', flag)
        .single();

      if (!data || !data.enabled) return false;

      // Vérification whitelist utilisateur
      if (data.user_whitelist && userId && !data.user_whitelist.includes(userId)) {
        return false;
      }

      // Activation progressive par pourcentage
      if (data.rollout_percentage && data.rollout_percentage < 100) {
        const userHash = this.hashUserId(userId || 'anonymous');
        return userHash % 100 < data.rollout_percentage;
      }

      return true;
    } catch (error) {
      console.error(`Feature flag error for ${flag}:`, error);
      return false; // Par défaut désactivé en cas d'erreur
    }
  }

  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % 100;
  }

  async getAllFlags(): Promise<Record<FeatureFlag, FeatureFlagConfig>> {
    const { data } = await this.supabase
      .from('feature_flags')
      .select('*');

    const flags: Record<FeatureFlag, FeatureFlagConfig> = {} as any;

    data?.forEach(flag => {
      flags[flag.flag as FeatureFlag] = {
        enabled: flag.enabled,
        description: flag.description,
        rollout_percentage: flag.rollout_percentage,
        user_whitelist: flag.user_whitelist,
      };
    });

    return flags;
  }

  async updateFlag(flag: FeatureFlag, config: Partial<FeatureFlagConfig>): Promise<void> {
    await this.supabase
      .from('feature_flags')
      .upsert({
        flag,
        ...config,
        updated_at: new Date().toISOString(),
      });
  }
}

// Hook React pour utiliser les feature flags
export function useFeatureFlag(flag: FeatureFlag, userId?: string): boolean {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFlag = async () => {
      try {
        const service = new FeatureFlagService();
        const isEnabled = await service.isEnabled(flag, userId);
        setEnabled(isEnabled);
      } catch (error) {
        console.error(`Feature flag check failed for ${flag}:`, error);
        setEnabled(false); // Par défaut désactivé
      } finally {
        setLoading(false);
      }
    };

    checkFlag();
  }, [flag, userId]);

  return enabled;
}

// Hook avec loading state
export function useFeatureFlagWithLoading(flag: FeatureFlag, userId?: string) {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFlag = async () => {
      try {
        const service = new FeatureFlagService();
        const isEnabled = await service.isEnabled(flag, userId);
        setEnabled(isEnabled);
      } catch (error) {
        console.error(`Feature flag check failed for ${flag}:`, error);
        setEnabled(false);
      } finally {
        setLoading(false);
      }
    };

    checkFlag();
  }, [flag, userId]);

  return { enabled, loading };
}
```

### Configuration par Environnement

```typescript
// config/feature-flags.ts
export const FEATURE_FLAG_CONFIG = {
  development: {
    'gamification': true,
    'social-features': true,
    'advanced-analytics': true,
    'internationalization': false,
    'pwa-offline': false,
    'ai-recommendations': false,
    'ab-testing': false,
    'business-intelligence': false,
    'automation-workflows': false,
    'multi-tenant': false,
  },

  staging: {
    'gamification': true,
    'social-features': false,
    'advanced-analytics': true,
    'internationalization': false,
    'pwa-offline': false,
    'ai-recommendations': false,
    'ab-testing': false,
    'business-intelligence': false,
    'automation-workflows': false,
    'multi-tenant': false,
  },

  production: {
    'gamification': false, // À activer après tests
    'social-features': false,
    'advanced-analytics': false,
    'internationalization': false,
    'pwa-offline': false,
    'ai-recommendations': false,
    'ab-testing': false,
    'business-intelligence': false,
    'automation-workflows': false,
    'multi-tenant': false,
  }
} as const;
```

### Composant d'Activation Conditionnelle

```typescript
// packages/ui/src/components/FeatureGuard.tsx
import React from 'react';
import { useFeatureFlag } from '@makethechange/feature-flags';
import { FeatureFlag } from '@makethechange/feature-flags';
import { LoadingSpinner } from './LoadingSpinner';

interface FeatureGuardProps {
  flag: FeatureFlag;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  userId?: string;
  showLoadingSpinner?: boolean;
}

export function FeatureGuard({
  flag,
  fallback = null,
  children,
  userId,
  showLoadingSpinner = false
}: FeatureGuardProps) {
  const { enabled, loading } = useFeatureFlag(flag, userId);

  if (loading && showLoadingSpinner) {
    return <LoadingSpinner />;
  }

  if (!enabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Hook pour les composants impératifs
export function withFeatureFlag<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  flag: FeatureFlag,
  fallback?: React.ReactNode
) {
  return function FeatureGuardedComponent(props: P & { userId?: string }) {
    return (
      <FeatureGuard flag={flag} fallback={fallback} userId={props.userId}>
        <WrappedComponent {...props} />
      </FeatureGuard>
    );
  };
}
```

### Schéma Base de Données

```sql
-- Table pour gérer les feature flags
CREATE TABLE feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag TEXT NOT NULL UNIQUE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  rollout_percentage INTEGER CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  user_whitelist TEXT[], -- Liste d'utilisateurs spécifiques
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour les performances
CREATE INDEX idx_feature_flags_flag ON feature_flags(flag);
CREATE INDEX idx_feature_flags_enabled ON feature_flags(enabled);

-- Insertion des flags par défaut
INSERT INTO feature_flags (flag, enabled, description) VALUES
('gamification', false, 'Système de badges, niveaux et récompenses'),
('social-features', false, 'Partage, communauté, réseaux sociaux'),
('advanced-analytics', false, 'Analytics avancés et business intelligence'),
('internationalization', false, 'Support multi-langues'),
('pwa-offline', false, 'Progressive Web App et mode hors ligne'),
('ai-recommendations', false, 'Recommandations personnalisées par IA'),
('ab-testing', false, 'Système de tests A/B'),
('business-intelligence', false, 'Tableaux de bord BI avancés'),
('automation-workflows', false, 'Workflows automatisés'),
('multi-tenant', false, 'Support multi-organisations');
```

## Dashboard Admin pour Contrôle

### Composant de Gestion des Feature Flags

```typescript
// apps/web-admin/components/admin/FeatureFlagsManager.tsx
import { useState, useEffect } from 'react';
import { FeatureFlagService, FeatureFlag, FeatureFlagConfig } from '@makethechange/feature-flags';
import { Button } from '@makethechange/ui';
import { Switch } from '@makethechange/ui';
import { Input } from '@makethechange/ui';

export function FeatureFlagsManager() {
  const [flags, setFlags] = useState<Record<FeatureFlag, FeatureFlagConfig>>({} as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {
      const service = new FeatureFlagService();
      const allFlags = await service.getAllFlags();
      setFlags(allFlags);
    } catch (error) {
      console.error('Erreur chargement flags:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFlag = async (flag: FeatureFlag, config: Partial<FeatureFlagConfig>) => {
    try {
      const service = new FeatureFlagService();
      await service.updateFlag(flag, config);
      await loadFlags(); // Recharger les données
    } catch (error) {
      console.error('Erreur mise à jour flag:', error);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestion des Feature Flags</h1>

      <div className="grid gap-4">
        {Object.entries(flags).map(([flag, config]) => (
          <div key={flag} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">{flag}</h3>
                <p className="text-sm text-gray-600">{config.description}</p>
              </div>

              <Switch
                checked={config.enabled}
                onCheckedChange={(enabled) =>
                  updateFlag(flag as FeatureFlag, { enabled })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Rollout (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={config.rollout_percentage || 0}
                  onChange={(e) =>
                    updateFlag(flag as FeatureFlag, {
                      rollout_percentage: parseInt(e.target.value)
                    })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Utilisateurs spécifiques
                </label>
                <Input
                  placeholder="user1@example.com, user2@example.com"
                  value={config.user_whitelist?.join(', ') || ''}
                  onChange={(e) =>
                    updateFlag(flag as FeatureFlag, {
                      user_whitelist: e.target.value
                        .split(',')
                        .map(email => email.trim())
                        .filter(email => email)
                    })
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Bénéfices du Système

### Pour le Développement
- **Déploiement sécurisé** : Activation progressive
- **Tests A/B** : Comparaison features
- **Rollbacks instantanés** : Désactivation en cas de problème
- **Analytics détaillés** : Impact mesuré par feature

### Pour les Utilisateurs
- **Expérience personnalisée** : Différentes versions selon segments
- **Tests utilisateurs** : Nouvelles features sur échantillons
- **Performance optimisée** : Code inutilisé non chargé
- **Feedback continu** : Itération basée sur données réelles

### Pour le Business
- **Risque réduit** : Activation contrôlée
- **ROI optimisé** : Focus sur features rentables
- **Scalabilité** : Architecture pensée pour grandir
- **Flexibilité** : Adaptation rapide au marché

Cette configuration vous permet de **garder votre vision complète tout en contrôlant parfaitement l'activation des fonctionnalités** ! 🎯
