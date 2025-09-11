// eslint-disable-next-line no-restricted-imports
import { type TextInput as BaseInput, TextInputProps, View } from 'react-native';
import { FormTextFieldLabel } from '@/src/components/form/form-text-field-label';
import { Input } from '@/src/components/ui/input';
import { ForwardedRef, forwardRef } from 'react';
import { useFieldContext } from '@/src/components/form/form-context';
import { ErrorMessage } from '@/src/components/form/error-message';

export type FormTextFieldProps = {
  label?: string;
} & TextInputProps;

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

export const FormTextField = forwardRef(FormTextFieldComponent) as (
  props: FormTextFieldProps & { ref?: React.Ref<BaseInput> }
) => JSX.Element;
