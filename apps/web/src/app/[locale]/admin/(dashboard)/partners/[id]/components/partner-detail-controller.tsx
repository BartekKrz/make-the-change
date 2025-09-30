'use client';

import { useState } from 'react';
import { type FC } from 'react';

import { PartnerBreadcrumbs } from '@/app/[locale]/admin/(dashboard)/partners/[id]/components/partner-breadcrumbs';
import { PartnerCompactHeader } from '@/app/[locale]/admin/(dashboard)/partners/[id]/components/partner-compact-header';
import { PartnerDetailLayout } from '@/app/[locale]/admin/(dashboard)/partners/[id]/components/partner-detail-layout';
import { PartnerDetailsEditor } from '@/app/[locale]/admin/(dashboard)/partners/[id]/components/partner-details-editor';

import type { PartnerFormData } from '@make-the-change/api/validators/partner';

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
      toolbar={<div />}
      content={
        <PartnerDetailsEditor
          isEditing={isEditing}
          isSaving={isSaving}
          partnerData={partnerData}
          onSave={handleSave}
        />
      }
      header={
        <>
          <PartnerBreadcrumbs partnerData={partnerData} />
          <PartnerCompactHeader
            isEditing={isEditing}
            isSaving={isSaving}
            partnerData={partnerData}
            onEditToggle={setIsEditing}
            onSave={() =>
              document
                .querySelector('#partner-editor-form')
                ?.dispatchEvent(
                  new Event('submit', { cancelable: true, bubbles: true })
                )
            }
          />
        </>
      }
    />
  );
};
