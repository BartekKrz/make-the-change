'use client';
import { type FC } from 'react';
import { type ComponentProps, useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/app/admin/(dashboard)/components/cn';
import { CheckCircle2, SendIcon } from 'lucide-react';

type Props = ComponentProps<typeof Button> & {
  pendingText?: string;
  successText?: string;
  showLoadingIndicator?: boolean;
  showSuccessIndicator?: boolean;
  successDuration?: number;
  autoSuccess?: boolean;
  forceSuccess?: boolean;
};

export const SubmitButton: FC<Props> = ({
  children,
  pendingText = 'En cours...',
  successText = 'Succès!',
  showLoadingIndicator: _showLoadingIndicator = true,
  showSuccessIndicator = true,
  successDuration = 2000,
  autoSuccess = false,
  forceSuccess = false,
  className,
  variant = 'default',
  icon,
  ...props
}) => {
  const { pending } = useFormStatus();
  const [showSuccess, setShowSuccess] = useState(false);
  const [wasPending, setWasPending] = useState(false);

  useEffect(() => {
    if (pending) setWasPending(true);
  }, [pending]);

  useEffect(() => {
    if (!forceSuccess) return;
    setShowSuccess(true);
    const timer = setTimeout(() => setShowSuccess(false), successDuration);
    return () => clearTimeout(timer);
  }, [forceSuccess, successDuration]);

  useEffect(() => {
    if (autoSuccess && wasPending && !pending) {
      setShowSuccess(true);
      setWasPending(false);
      const timer = setTimeout(() => setShowSuccess(false), successDuration);
      return () => clearTimeout(timer);
    } else if (wasPending && !pending) {
      setWasPending(false);
    }
  }, [pending, wasPending, successDuration, autoSuccess]);

  return (
    <Button
      type='submit'
      disabled={pending || showSuccess}
      loading={pending}
      loadingText={pendingText}
      variant={showSuccess ? 'success' : variant}
      icon={showSuccess ? <CheckCircle2 className='h-4 w-4' /> : (icon ?? <SendIcon className='h-4 w-4' />)}
      className={cn('transition-all duration-200', pending && 'cursor-wait', className)}
      {...props}
    >
      {showSuccess && showSuccessIndicator ? successText : children}
    </Button>
  );
};
