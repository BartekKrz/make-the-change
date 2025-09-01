'use client';

import { useState } from 'react';
import { FC } from 'react';
import { PartnerDetailLayout } from '@/app/admin/(dashboard)/partners/[id]/components/partner-detail-layout';
import { PartnerCompactHeader } from '@/app/admin/(dashboard)/partners/[id]/components/partner-compact-header';
import { PartnerDetailsEditor } from '@/app/admin/(dashboard)/partners/[id]/components/partner-details-editor';
import { PartnerBreadcrumbs } from '@/app/admin/(dashboard)/partners/[id]/components/partner-breadcrumbs';
import { PartnerFormData } from '@make-the-change/api/validators/partner';


type PartnerDetailControllerProps = {
  partnerData: PartnerFormData & { id: string };
  onSave: (patch: Partial<PartnerFormData>) => Promise<void>;
};

export const PartnerDetailController: FC<PartnerDetailControllerProps> = ({
  partnerData,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (formData: PartnerFormData) => {
    setIsSaving(true);
    try {
      const patch: Partial<PartnerFormData> = {};
      for (const key of Object.keys(formData) as (keyof PartnerFormData)[]) {
        if (partnerData[key] !== formData[key]) {
          (patch as any)[key] = formData[key];
        }
      }

      if (Object.keys(patch).length > 0) {
        await onSave(patch);
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving partner:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <PartnerDetailLayout
      header={
        <>
          <PartnerBreadcrumbs partnerData={partnerData} />
          <PartnerCompactHeader
            partnerData={partnerData}
            isEditing={isEditing}
            onEditToggle={setIsEditing}
            onSave={() => document.getElementById('partner-editor-form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
            isSaving={isSaving}
          />
        </>
      }
      toolbar={<div />}
      content={
        <PartnerDetailsEditor
          partnerData={partnerData}
          isEditing={isEditing}
          isSaving={isSaving}
          onSave={handleSave}
        />
      }
    />
  );
};
