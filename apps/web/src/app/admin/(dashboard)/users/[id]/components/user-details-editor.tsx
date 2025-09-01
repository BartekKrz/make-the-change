'use client';

import { useCallback } from 'react';
import type { FC, PropsWithChildren } from 'react';
import { User, Shield, Mail, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/admin/(dashboard)/components/ui/card';
import { Button } from '@/app/admin/(dashboard)/components/ui/button';
import { useFormWithToast } from '@/hooks/use-form-with-toast';
import { FormInput, FormSelect } from '@/components/form';
import { z } from 'zod';

const userEditSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom ne peut pas dépasser 100 caractères').trim(),
  email: z.string().min(1, 'L\'email est requis').email('Format d\'email invalide').max(100, 'L\'email ne peut pas dépasser 100 caractères'),
  role: z.enum(['admin', 'user']).default('user'),
  is_active: z.boolean().default(true),
});

type UserEditData = z.infer<typeof userEditSchema>;

type UserDetailsEditorProps = {
  userData: UserEditData & { id: string };
  isEditing: boolean;
  isSaving?: boolean;
  onSave?: (data: UserEditData) => Promise<void>;
};

const UserCardsGrid: FC<PropsWithChildren> = ({ children }) => (
  <div className='grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 [&>*]:h-full'>{children}</div>
);

const roleOptions = [
  { value: 'user', label: 'Utilisateur' },
  { value: 'admin', label: 'Administrateur' },
];

export const UserDetailsEditor: FC<UserDetailsEditorProps> = ({
  userData,
  isEditing,
  isSaving = false,
  onSave,
}) => {
  const { form, isSubmitting } = useFormWithToast({
    defaultValues: {
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'user',
      is_active: userData.is_active ?? true,
    } as UserEditData,
    onSubmit: async (value: UserEditData) => {
      if (onSave) {
        await onSave(value);
        return { success: true };
      }
      return { success: true };
    },
    toasts: {
      success: {
        title: 'Utilisateur mis à jour',
        description: 'Les modifications ont été enregistrées avec succès'
      },
      error: {
        title: 'Erreur',
        description: 'Impossible de mettre à jour l\'utilisateur'
      }
    }
  });

  const contentSections = [
    {
      id: 'account',
      title: 'Informations du compte',
      icon: User,
      content: (
        <div className='space-y-4'>
          <form.Field name="name">
            {(field) => (
              <FormInput
                field={field}
                label="Nom complet"
                placeholder="Nom complet"
                disabled={!isEditing}
                required
              />
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <FormInput
                field={field}
                label="Adresse e-mail"
                type="email"
                placeholder="email@example.com"
                disabled={!isEditing}
                required
              />
            )}
          </form.Field>
        </div>
      )
    },
    {
      id: 'permissions',
      title: 'Permissions et Statut',
      icon: Shield,
      content: (
        <div className='space-y-4'>
          <form.Field name="role">
            {(field) => (
              <FormSelect
                field={field}
                label="Rôle"
                placeholder="Sélectionner un rôle"
                options={roleOptions}
                disabled={!isEditing}
              />
            )}
          </form.Field>

          <form.Field name="is_active">
            {(field: any) => (
              <div className='pt-2'>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.state.value}
                    onChange={(e) => field.handleChange(e.target.checked)}
                    onBlur={field.handleBlur}
                    disabled={!isEditing}
                  />
                  <span className="text-sm font-medium">Compte actif</span>
                  {field.state.value && (
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                  )}
                </label>
              </div>
            )}
          </form.Field>
        </div>
      )
    },
  ];

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      e.stopPropagation()
      form.handleSubmit()
    }} className='space-y-6 md:space-y-8'>
      <UserCardsGrid>
        {contentSections.map((section) => (
          <Card key={section.id} className='transition-all duration-200 hover:shadow-lg'>
            <CardHeader className='pb-4'>
              <CardTitle className='flex items-center gap-3 text-lg'>
                <div className='p-2 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-lg border border-primary/20'>
                  <section.icon className='h-5 w-5 text-primary' />
                </div>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className='pt-0'>
              {section.content}
            </CardContent>
          </Card>
        ))}
      </UserCardsGrid>

      {}
      {isEditing && (
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || isSaving}
            className="flex items-center gap-2"
          >
            {(isSubmitting || isSaving) ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Sauvegarder
              </>
            )}
          </Button>
        </div>
      )}
    </form>
  );
};
