# Analyse de l'implémentation Tanstack Form

Cette analyse examine l'excellente utilisation de Tanstack Form v1.1.0 dans ce projet React Native, démontrant une architecture modulaire, type-safe et performante.

## 1. Architecture modulaire et réutilisable

### Contextes partagés
**Fichier :** `src/components/form/form-context.ts`

```typescript
import { createFormHookContexts } from '@tanstack/react-form';

export const { 
  fieldContext, 
  formContext, 
  useFieldContext, 
  useFormContext 
} = createFormHookContexts();
```

### Hook personnalisé principal
**Fichier :** `src/components/form/app-form.ts`

```typescript
import { createFormHook } from '@tanstack/react-form';
import { FormTextField } from '@/src/components/form/form-text-field';
import { FormTextFieldMultiline } from '@/src/components/form/form-text-field-multiline';
import { FormPasswordField } from '@/src/components/form/form-password-field';
import { fieldContext, formContext } from '@/src/components/form/form-context';

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FormTextField,
    FormTextFieldMultiline,
    FormPasswordField
  },
  formComponents: {}
});
```

## 2. Composants de champs intelligents

### Pattern uniforme pour tous les champs

Tous les composants de champs suivent le même pattern :

**FormTextField** (`src/components/form/form-text-field.tsx`) :
```typescript
import { useFieldContext } from '@/src/components/form/form-context';
import { ErrorMessage } from '@/src/components/form/error-message';

const FormTextFieldComponent = ({ label, ...props }: FormTextFieldProps, ref: ForwardedRef<BaseInput>) => {
  const field = useFieldContext<string>();
  const errors = field.state.meta.errors;

  return (
    <View className='gap-2'>
      {label && <FormTextFieldLabel label={label} />}
      <Input
        ref={ref}
        value={field.state.value == null ? '' : String(field.state.value)}
        onChangeText={(text) => field.handleChange(text)}
        onBlur={field.handleBlur}
        {...props}
      />
      {errors.length > 0 && <ErrorMessage errors={errors} />}
    </View>
  );
};

export const FormTextField = forwardRef(FormTextFieldComponent);
```

**FormPasswordField** avec fonctionnalités avancées :
```typescript
const FormPasswordFieldComponent = ({ ...props }: TextInputProps, ref: ForwardedRef<BaseInput>) => {
  const field = useFieldContext<string>();
  const errors = field.state.meta.errors;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <>
      <View className='h-12 flex-row rounded-xl bg-white'>
        <TextInput
          ref={ref}
          value={field.state.value == null ? '' : String(field.state.value)}
          onBlur={field.handleBlur}
          onChangeText={(text) => field.handleChange(text)}
          secureTextEntry={!isPasswordVisible}
          {...props}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <FontAwesome6 name={isPasswordVisible ? 'eye-slash' : 'eye'} size={14} />
        </TouchableOpacity>
      </View>
      {errors.length > 0 && <ErrorMessage errors={errors} />}
    </>
  );
};
```

### Gestion des erreurs unifiée
```typescript
// src/components/form/error-message.tsx
export const ErrorMessage: FC<ErrorMessageProps> = ({ errors }) => {
  const error = errors[0];
  
  if (typeof error === 'string') 
    return <Text className='color-error'>{errors.join(', ')}</Text>;
  
  return <Text className='font-poppins-regular color-error'>{error?.message}</Text>;
};
```

## 3. Validation avec Zod et i18n

### Exemple complet : Formulaire de connexion
**Fichier :** `src/app/(public)/login.tsx`

```typescript
import * as z from 'zod';
import { msg, t } from '@lingui/core/macro';
import { useAppForm } from '@/src/components/form/app-form';

// Schema de validation localisé
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email(msg`Email invalide`),
  password: z.string().min(6, msg`Le mot de passe doit contenir au moins 6 caractères`)
});

const LoginScreen: FC = () => {
  const { mutateAsync: signInAsync } = useSignInMutation();
  
  const form = useAppForm({
    defaultValues: {
      email: '',
      password: ''
    },
    validators: {
      onSubmit: loginSchema
    },
    onSubmit: async ({ value }) => {
      try {
        await signInAsync(value);
        router.replace('/(authenticated)');
      } catch (e) {
        const error = e as AxiosError;
        if (error.status === 400) {
          toast.error('Les identifiants entrés ne correspondent pas');
        } else {
          toast.error('Une erreur est survenue lors de la connexion');
        }
      }
    }
  });

  return (
    <form.AppForm>
      <form.AppField
        name='email'
        children={(field) => (
          <field.FormTextField
            placeholder={t`Adresse e-mail`}
            inputMode='email'
            autoCapitalize='none'
            returnKeyType='next'
            onSubmitEditing={() => passwordInputRef.current?.focus()}
          />
        )}
      />
      <form.AppField
        name='password'
        children={(field) => (
          <field.FormPasswordField
            ref={passwordInputRef}
            placeholder={t`Mot de passe`}
            returnKeyType='done'
            onSubmitEditing={() => form.handleSubmit()}
          />
        )}
      />
      <FormSubmitGradientButton>
        <Text>Se connecter</Text>
      </FormSubmitGradientButton>
    </form.AppForm>
  );
};
```

## 4. Gestion des soumissions et états réactifs

### Bouton de soumission intelligent
**Fichier :** `src/components/form/form-submit-button.tsx`

```typescript
export const FormSubmitButton: FC<PropsWithChildren> = ({ children }) => {
  const form = useFormContext();
  
  return (
    <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
      {([isSubmitting, canSubmit]) => (
        <Button 
          onPress={form.handleSubmit} 
          disabled={!canSubmit || isSubmitting} 
          isLoading={isSubmitting}
        >
          {children}
        </Button>
      )}
    </form.Subscribe>
  );
};
```

### Subscribe pattern avancé
```typescript
// Exemple d'usage dans un modal
<form.Subscribe selector={(state) => [state.isSubmitting, state.values.eta]}>
  {([isSubmitting]) => (
    <AgnosticModal.Button
      disabled={!dateUtils.isDateAfter(selectedDate, requestedAtUTC ?? sentAtUTC)}
      isLoading={isSubmitting}
      onPress={handleConfirm}
    >
      <Trans>Confirmer</Trans>
    </AgnosticModal.Button>
  )}
</form.Subscribe>
```

## 5. Spécialisation par domaine

### Contexte dédié pour les commandes ETA
**Fichier :** `src/features/shop/orders/to-treat/shared/order-eta-form-context.tsx`

```typescript
// Contextes spécialisés
export const {
  fieldContext: etaFieldContext,
  formContext: etaFormContext,
  useFieldContext: useETAFieldContext,
  useFormContext: useETAFormContext
} = createFormHookContexts();

// Hook spécialisé
export const { useAppForm: useETAForm } = createFormHook({
  fieldContext: etaFieldContext,
  formContext: etaFormContext,
  fieldComponents: {},
  formComponents: {}
});

// Schema de validation spécialisé
const getUpdateETAOrderSchema = () =>
  z.object({
    eta: z.date({
      message: msg`Une date valide est requise`.comment
    })
  });

// Options de formulaire réutilisables
export const etaFormOpts = formOptions({
  validators: {
    onBlur: getUpdateETAOrderSchema(),
    onChange: getUpdateETAOrderSchema(),
    onSubmit: getUpdateETAOrderSchema()
  }
});
```

### Utilisation dans un composant
```typescript
// src/features/shop/orders/to-treat/pending/pending-order-form.tsx
export const PendingOrderForm: FC<PendingOrdersFormProps> = ({ order }) => {
  const modal = useModalContext();
  
  const etaForm = useETAForm({
    ...etaFormOpts,
    defaultValues: {
      eta: order.requestedAtUTC ?? order.sentAtUTC
    },
    onSubmit: () => modal.close()
  });

  return (
    <Popup>
      <etaForm.AppForm>
        <OrderDetails order={order} />
        <OrderActions orderId={order.id} />
      </etaForm.AppForm>
    </Popup>
  );
};
```

## 6. Patterns avancés

### DatePicker intégré avec validation
```typescript
// src/features/shop/orders/processed/details/update-eta-order-modal.tsx
export const UpdateETAOrderModal: FC<UpdateETAOrderModalProps> = ({ visible, onClose }) => {
  const field = useETAFieldContext<Date>();
  const form = useETAFormContext();
  
  const now = new Date(Date.now());
  const [selectedDate, setSelectedDate] = useState(
    field.state.value < now ? now : field.state.value
  );

  const handleConfirm = () => {
    field.setValue(selectedDate);
    field.form.handleSubmit();
  };

  return (
    <AgnosticModal.Layout visible={visible} onClose={onClose}>
      <DatePicker 
        date={selectedDate} 
        mode='datetime' 
        minimumDate={now} 
        onDateChange={setSelectedDate} 
      />
      
      <form.Subscribe selector={(state) => [state.isSubmitting]}>
        {([isSubmitting]) => (
          <AgnosticModal.Button
            disabled={!dateUtils.isDateAfter(selectedDate, requestedAtUTC ?? sentAtUTC)}
            isLoading={isSubmitting}
            onPress={handleConfirm}
          >
            Confirmer
          </AgnosticModal.Button>
        )}
      </form.Subscribe>
    </AgnosticModal.Layout>
  );
};
```

### Intégration avec le stockage persistant
```typescript
// Exemple de récupération des valeurs stockées
const { data: storedValues, isSuccess: isStoredValuesSuccess } = useQuery({
  queryKey: ['stored-email'],
  queryFn: async () => ({ email: await Storage.tryGetItemAsync('email') })
});

// Application des valeurs lors du montage
useEffect(() => {
  if (isStoredValuesSuccess && storedValues.email) {
    form.setFieldValue('email', storedValues.email);
  }
}, [isStoredValuesSuccess, storedValues, form]);
```

## 7. Points forts de cette implémentation

### ✅ **Architecture**
- **Modulaire** : Contextes partagés et spécialisés selon le besoin
- **Réutilisable** : Composants de champs utilisables dans tous les formulaires
- **Type-safe** : TypeScript intégré avec `useFieldContext<T>()`

### ✅ **Performance**
- **Optimisée** : Utilisation intelligente de `form.Subscribe` avec sélecteurs
- **Reactive** : Mises à jour granulaires de l'UI

### ✅ **UX/DX**
- **Cohérente** : Gestion uniforme des erreurs et états de chargement  
- **Accessible** : Support des `forwardRef` pour navigation clavier
- **Intuitive** : API simple et prévisible

### ✅ **Validation**
- **Robuste** : Intégration native avec Zod
- **Localisée** : Messages d'erreur internationalisés
- **Flexible** : Validation à plusieurs niveaux (onChange, onBlur, onSubmit)

### ✅ **État**
- **Intelligent** : Gestion fine avec des composants externes (DatePicker)
- **Persistant** : Intégration avec le stockage local
- **Réactif** : Boutons et UI qui s'adaptent à l'état du formulaire

Cette implémentation démontre une maîtrise exceptionnelle de Tanstack Form, créant une base solide et scalable pour tous les formulaires de l'application.