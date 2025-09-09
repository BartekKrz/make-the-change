// Exemple d'utilisation de l'architecture composable pour une page utilisateur
// Démontre la réutilisabilité de DetailView pour différentes entités

import { AdminPageLayout } from '@/app/[locale]/admin/(dashboard)/components/admin-layout'
import { AdminDetailLayout } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-layout'
import { AdminDetailHeader, AdminDetailActions } from '@/app/[locale]/admin/(dashboard)/components/layout/admin-detail-header'
import { DetailView } from '@/app/[locale]/admin/(dashboard)/components/ui/detail-view'
import { Input } from '@/components/ui/input'
import { FormSelect, FormToggle } from '@/app/[locale]/admin/(dashboard)/components/ui/form-components'
import { User, Shield, Mail, MapPin, CreditCard, Home } from 'lucide-react'

// Exemple de page utilisateur utilisant la MÊME architecture que les produits
const UserDetailPage = ({ userId }: { userId: string }) => {
  // ... logique de data fetching et hooks (useEntityForm)
  
  const breadcrumbs = [
    { href: '/admin/dashboard', label: 'Tableau de bord', icon: Home },
    { href: '/admin/users', label: 'Utilisateurs', icon: User },
    { label: 'John Doe' }
  ]

  return (
    <AdminPageLayout>
      <AdminDetailLayout
        headerContent={
          <AdminDetailHeader
            breadcrumbs={breadcrumbs}
            title="John Doe"
            subtitle="Utilisateur • Ambassadeur depuis 2023"
            actions={
              <AdminDetailActions
                saveStatus={{ type: 'pristine', message: 'Sauvegardé' }}
                primaryActions={
                  <button className="px-4 py-2 bg-primary text-white rounded-lg">
                    Envoyer un message
                  </button>
                }
              />
            }
          />
        }
      >
        <DetailView variant="cards" spacing="md" gridCols={2}>
          {/* Section Profil */}
          <DetailView.Section icon={User} title="Informations personnelles">
            <DetailView.Field label="Nom complet" required>
              <Input value="John Doe" />
            </DetailView.Field>
            
            <DetailView.Field label="Email" required>
              <Input type="email" value="john@example.com" />
            </DetailView.Field>
            
            <DetailView.Field label="Téléphone">
              <Input value="+33 1 23 45 67 89" />
            </DetailView.Field>
          </DetailView.Section>

          {/* Section Permissions */}
          <DetailView.Section icon={Shield} title="Permissions & Accès">
            <DetailView.Field label="Niveau d'accès">
              <FormSelect
                value="ambassadeur"
                onChange={() => {}}
                options={[
                  { value: 'explorateur', label: 'Explorateur' },
                  { value: 'protecteur', label: 'Protecteur' },
                  { value: 'ambassadeur', label: 'Ambassadeur' }
                ]}
              />
            </DetailView.Field>

            <DetailView.FieldGroup layout="column">
              <DetailView.Field label="Statut du compte">
                <FormToggle
                  checked={true}
                  onChange={() => {}}
                  label="Compte actif"
                  description="L'utilisateur peut se connecter et utiliser la plateforme"
                />
              </DetailView.Field>

              <DetailView.Field label="Newsletter">
                <FormToggle
                  checked={false}
                  onChange={() => {}}
                  label="Abonné à la newsletter"
                  description="Reçoit les mises à jour par email"
                />
              </DetailView.Field>
            </DetailView.FieldGroup>
          </DetailView.Section>

          {/* Section Localisation - Span sur 2 colonnes */}
          <DetailView.Section icon={MapPin} title="Localisation & Préférences" span={2}>
            <DetailView.FieldGroup layout="grid-3">
              <DetailView.Field label="Pays">
                <FormSelect
                  value="FR"
                  onChange={() => {}}
                  options={[
                    { value: 'FR', label: 'France' },
                    { value: 'BE', label: 'Belgique' },
                    { value: 'CH', label: 'Suisse' }
                  ]}
                />
              </DetailView.Field>

              <DetailView.Field label="Langue préférée">
                <FormSelect
                  value="fr"
                  onChange={() => {}}
                  options={[
                    { value: 'fr', label: 'Français' },
                    { value: 'en', label: 'English' },
                    { value: 'de', label: 'Deutsch' }
                  ]}
                />
              </DetailView.Field>

              <DetailView.Field label="Fuseau horaire">
                <FormSelect
                  value="Europe/Paris"
                  onChange={() => {}}
                  options={[
                    { value: 'Europe/Paris', label: 'Europe/Paris (CET)' },
                    { value: 'Europe/London', label: 'Europe/London (GMT)' }
                  ]}
                />
              </DetailView.Field>
            </DetailView.FieldGroup>
          </DetailView.Section>
        </DetailView>
      </AdminDetailLayout>
    </AdminPageLayout>
  )
}

// Exemple pour une page projet
const ProjectDetailPage = ({ projectId }: { projectId: string }) => {
  return (
    <AdminPageLayout>
      <AdminDetailLayout
        headerContent={
          <AdminDetailHeader
            breadcrumbs={[
              { href: '/admin/dashboard', label: 'Tableau de bord', icon: Home },
              { href: '/admin/projects', label: 'Projets', icon: MapPin },
              { label: 'Ruches Madagascar' }
            ]}
            title="Ruches Madagascar"
            subtitle="Projet • 150 investisseurs • €45,000 collectés"
          />
        }
      >
        <DetailView variant="sidebar">
          {/* Section principale */}
          <DetailView.Section icon={MapPin} title="Informations générales">
            <DetailView.Field label="Nom du projet" required>
              <Input value="Ruches Madagascar" />
            </DetailView.Field>
            
            <DetailView.Field label="Localisation">
              <Input value="Andasibe, Madagascar" />
            </DetailView.Field>
            
            <DetailView.Field label="Partenaire">
              <FormSelect
                value="ilanga-nature"
                onChange={() => {}}
                options={[
                  { value: 'ilanga-nature', label: 'Ilanga Nature' },
                  { value: 'habeebee', label: 'Habeebee' }
                ]}
              />
            </DetailView.Field>
          </DetailView.Section>

          {/* Section métriques */}
          <DetailView.Section icon={CreditCard} title="Métriques financières">
            <DetailView.FieldGroup layout="grid-2">
              <DetailView.Field label="Objectif de financement">
                <Input value="50000" type="number" />
              </DetailView.Field>
              
              <DetailView.Field label="Montant collecté">
                <Input value="45000" type="number" disabled />
              </DetailView.Field>
            </DetailView.FieldGroup>

            <DetailView.Field label="Statut du projet">
              <FormToggle
                checked={true}
                onChange={() => {}}
                label="Projet actif"
                description="Accepte les nouveaux investissements"
              />
            </DetailView.Field>
          </DetailView.Section>
        </DetailView>
      </AdminDetailLayout>
    </AdminPageLayout>
  )
}

// ✅ MÊME architecture, différentes entités !
// - Réutilisation complète des composants
// - Logique métier adaptée via useEntityForm  
// - Layout flexible avec DetailView
// - Cohérence visuelle garantie