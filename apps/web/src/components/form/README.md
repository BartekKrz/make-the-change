# Form Components - Make the CHANGE

Ce dossier contient les composants de formulaires conformes aux conventions Make the CHANGE.

## 🏗️ Architecture

### Composants Principaux
- `form-field.tsx` - Composant de champ générique avec label et validation
- `form-input.tsx` - Input avec intégration TanStack Form
- `form-textarea.tsx` - Textarea avec intégration TanStack Form
- `form-select.tsx` - Select avec intégration TanStack Form
- `form-submit-button.tsx` - Bouton de soumission avec états de chargement
- `field-error.tsx` - Affichage des erreurs de validation

### Contextes
- `formContext` / `fieldContext` - Contextes TanStack Form standard
- `adminFormContext` / `adminFieldContext` - Contextes spécialisés administration

### Hooks
- `app-form.ts` - Hook simplifié pour TanStack Form

## 📋 Conventions Appliquées

### ✅ SYNTAXE ES6 & TYPESCRIPT
- **const par défaut** : Tous les `let` inutiles remplacés par `const`
- **Arrow functions** : Tous les composants et hooks en arrow functions
- **Imports types séparés** : `import type { FC } from 'react'`

### ✅ ORGANISATION DES IMPORTS
```typescript
// React imports
import { forwardRef } from 'react';

// External libraries
import { Plus } from 'lucide-react';

// Internal components
import { Button } from '@/app/admin/(dashboard)/components/ui/button';

// Internal utilities
import { useFormContext } from './form-context';

// Types séparés
import type { FC } from 'react';
```

### ✅ TYPESCRIPT STRICT
- Composants typés : `const Component: FC<Props> = ({ props }) => {}`
- ForwardedRef correctement typé
- Interfaces métier spécifiques exportées

### ✅ EXPORTS CONVENTIONNÉS
- Named exports pour tous les composants et hooks
- Types exportés séparément
- Index.ts centralisant tous les exports

## 🚀 Utilisation

```typescript
import {
  FormField,
  FormInput,
  FormSubmitButton,
  useAppForm,
  type FormFieldProps
} from '@/components/form';

// Exemple d'utilisation
const MyForm = () => {
  const form = useAppForm({
    defaultValues: { name: '' },
    onSubmit: async ({ value }) => {
      console.log('Form submitted:', value);
    }
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      form.handleSubmit();
    }}>
      <form.Field name="name">
        {() => (
          <FormInput label="Nom" placeholder="Votre nom" required />
        )}
      </form.Field>

      <FormSubmitButton>
        Envoyer
      </FormSubmitButton>
    </form>
  );
};
```

## 🔧 Maintenance

Ce dossier respecte parfaitement les conventions Make the CHANGE :
- ✅ Cohérence parfaite du code
- ✅ Maintenabilité optimale
- ✅ Performance et lisibilité maximales
- ✅ Respect des patterns métier biodiversité
