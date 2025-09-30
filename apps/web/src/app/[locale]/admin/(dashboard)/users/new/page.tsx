'use client';

import { ArrowLeft, User, Plus, Mail, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Badge } from '@/app/[locale]/admin/(dashboard)/components/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/[locale]/admin/(dashboard)/components/ui/card';
import { FormInput, FormSelect } from '@/components/form';
import { Button } from '@/components/ui/button';
import { useFormWithToast } from '@/hooks/use-form-with-toast';
import { trpc } from '@/lib/trpc';
import {
  defaultUserValues,
  userFormSchema,
  userLevelLabels,
  kycStatusLabels,
  countryOptions,
  type UserFormData,
} from '@/lib/validators/user';

import type { FC } from 'react';

const userLevelOptions = [
  { value: 'explorateur', label: 'Explorateur' },
  { value: 'protecteur', label: 'Protecteur' },
  { value: 'ambassadeur', label: 'Ambassadeur' },
];

const kycStatusOptions = [
  { value: 'pending', label: 'En attente' },
  { value: 'verified', label: 'Vérifié' },
  { value: 'rejected', label: 'Rejeté' },
];

const formattedCountryOptions = countryOptions.map(country => ({
  value: country,
  label: country,
}));

const NewUserPage: FC = () => {
  const router = useRouter();
  const utils = trpc.useUtils();

  const createUser = trpc.admin.users.create.useMutation({
    onMutate: async () => {
      await utils.admin.users.list.cancel();
      const prevData = utils.admin.users.list.getData();
      return { prevData };
    },
    onSuccess: data => {
      utils.admin.users.list.invalidate();
      router.push(`/admin/users/${data.id}`);
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.prevData) {
        utils.admin.users.list.setData(undefined, ctx.prevData);
      }
    },
    onSettled: () => {
      utils.admin.users.list.invalidate();
    },
  });

  const { form, isSubmitting, canSubmit } = useFormWithToast({
    defaultValues: defaultUserValues,
    onSubmit: async (value: UserFormData) => {
      const userData = {
        email: value.email.toLowerCase().trim(),
        password: value.password,
        user_level: value.user_level,
        points_balance: value.points_balance,
        kyc_status: value.kyc_status,
        raw_user_meta_data: {
          firstName: value.first_name?.trim(),
          lastName: value.last_name?.trim(),
          country: value.country,
        },
        send_welcome_email: value.send_welcome_email,
        is_active: value.is_active,
      };

      await createUser.mutateAsync(userData);
      return { success: true };
    },
    toasts: {
      success: {
        title: 'Utilisateur créé',
        description: "L'utilisateur a été créé avec succès",
      },
      error: {
        title: 'Erreur',
        description: "Impossible de créer l'utilisateur",
      },
    },
    redirectOnSuccess: '/admin/users',
  });

  const getUserLevelColor = (level: string) => {
    switch (level) {
      case 'ambassadeur': {
        return 'blue';
      }
      case 'protecteur': {
        return 'green';
      }
      case 'explorateur': {
        return 'gray';
      }
      default: {
        return 'gray';
      }
    }
  };

  const getKycStatusColor = (status: string) => {
    switch (status) {
      case 'verified': {
        return 'green';
      }
      case 'rejected': {
        return 'red';
      }
      case 'pending': {
        return 'yellow';
      }
      default: {
        return 'gray';
      }
    }
  };

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center gap-4">
        <Link
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
          href="/admin/users"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux utilisateurs
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <User className="text-primary h-6 w-6" />
        <h1 className="text-2xl font-bold">Nouvel utilisateur</h1>
      </div>

      {}
      <form
        className="space-y-6"
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Informations de connexion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form.Field name="email">
                {() => (
                  <FormInput
                    required
                    label="Email"
                    placeholder="utilisateur@example.com"
                    type="email"
                  />
                )}
              </form.Field>

              <form.Field name="password">
                {() => (
                  <FormInput
                    required
                    label="Mot de passe"
                    placeholder="Mot de passe sécurisé"
                    type="password"
                  />
                )}
              </form.Field>

              <form.Field name="confirmPassword">
                {() => (
                  <FormInput
                    required
                    label="Confirmer le mot de passe"
                    placeholder="Répéter le mot de passe"
                    type="password"
                  />
                )}
              </form.Field>
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form.Field name="first_name">
                {() => <FormInput label="Prénom" placeholder="Jean" />}
              </form.Field>

              <form.Field name="last_name">
                {() => <FormInput label="Nom" placeholder="Dupont" />}
              </form.Field>

              <form.Field name="country">
                {() => (
                  <FormSelect
                    label="Pays"
                    options={formattedCountryOptions}
                    placeholder="Sélectionner un pays"
                  />
                )}
              </form.Field>

              <form.Field name="points_balance">
                {() => (
                  <FormInput
                    description="Points de bienvenue (0-10000)"
                    label="Points initiaux"
                    max="10000"
                    min="0"
                    placeholder="100"
                    type="number"
                  />
                )}
              </form.Field>
            </CardContent>
          </Card>
        </div>

        {}
        <Card>
          <CardHeader>
            <CardTitle>Configuration du compte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <form.Field name="user_level">
                {field => (
                  <div>
                    <FormSelect
                      label="Niveau utilisateur"
                      options={userLevelOptions}
                      placeholder="Sélectionner un niveau"
                    />
                    <div className="mt-2">
                      <Badge color={getUserLevelColor(field.state.value)}>
                        {
                          userLevelLabels[
                            field.state.value as keyof typeof userLevelLabels
                          ]
                        }
                      </Badge>
                    </div>
                  </div>
                )}
              </form.Field>

              <form.Field name="kyc_status">
                {field => (
                  <div>
                    <FormSelect
                      label="Statut KYC"
                      options={kycStatusOptions}
                      placeholder="Sélectionner un statut"
                    />
                    <div className="mt-2">
                      <Badge color={getKycStatusColor(field.state.value)}>
                        {
                          kycStatusLabels[
                            field.state.value as keyof typeof kycStatusLabels
                          ]
                        }
                      </Badge>
                    </div>
                  </div>
                )}
              </form.Field>
            </div>

            <div className="flex flex-wrap gap-6">
              <form.Field name="is_active">
                {field => (
                  <label className="flex items-center gap-2">
                    <input
                      checked={field.state.value}
                      type="checkbox"
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.checked)}
                    />
                    <span className="text-sm">Compte actif</span>
                    <Badge color={field.state.value ? 'green' : 'red'}>
                      {field.state.value ? 'Actif' : 'Inactif'}
                    </Badge>
                  </label>
                )}
              </form.Field>

              <form.Field name="send_welcome_email">
                {field => (
                  <label className="flex items-center gap-2">
                    <input
                      checked={field.state.value}
                      type="checkbox"
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.checked)}
                    />
                    <span className="text-sm">
                      Envoyer l&apos;email de bienvenue
                    </span>
                    <Mail className="text-muted-foreground h-4 w-4" />
                  </label>
                )}
              </form.Field>
            </div>
          </CardContent>
        </Card>

        {}
        <div className="flex justify-end gap-3">
          <Button
            disabled={isSubmitting}
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Annuler
          </Button>
          <Button
            className="flex items-center gap-2"
            disabled={isSubmitting || !canSubmit}
            type="submit"
          >
            {isSubmitting ? (
              <>
                <div className="border-primary-foreground h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                Création...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Créer l&apos;utilisateur
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default NewUserPage;
