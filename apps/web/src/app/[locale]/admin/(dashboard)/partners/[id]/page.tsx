'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { type FC } from 'react';

import { PartnerDetailController } from '@/app/[locale]/admin/(dashboard)/partners/[id]/components/partner-detail-controller';
import { trpc } from '@/lib/trpc';

import type { PartnerFormData } from '@make-the-change/api/validators/partner';

const AdminPartnerEditPage: FC = () => {
  const params = useParams<{ id: string }>();
  const partnerId = params?.id as string;
  const utils = trpc.useUtils();

  const {
    data: partner,
    isLoading,
    error,
  } = trpc.admin.partners.byId.useQuery(
    { id: partnerId },
    {
      enabled: !!partnerId,
      retry: 1,
    }
  );

  const update = trpc.admin.partners.update.useMutation({
    onSuccess: () => {
      utils.admin.partners.byId.invalidate({ id: partnerId });
      utils.admin.partners.list.invalidate();
    },
    onError: error => {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la sauvegarde');
    },
  });

  const partnerData = useMemo(() => {
    return partner || null;
  }, [partner]);

  if (!partnerId) return <div className="p-8">ID de partenaire manquant</div>;
  if (isLoading) return <div className="p-8">Chargement du partenaire...</div>;
  if (error) return <div className="p-8">Erreur: {error.message}</div>;
  if (!partnerData) return <div className="p-8">Partenaire non trouvé</div>;

  const handleSave = async (patch: Partial<PartnerFormData>) => {
    await update.mutateAsync({
      id: partnerId,
      patch,
    });
  };

  return (
    <PartnerDetailController
      partnerData={partnerData as PartnerFormData & { id: string }}
      onSave={handleSave}
    />
  );
};

export default AdminPartnerEditPage;
