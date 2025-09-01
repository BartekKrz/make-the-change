'use client';

import { useState } from 'react';
import { type FC } from 'react';
import { ProjectDetailLayout } from '@/app/admin/(dashboard)/projects/[id]/components/project-detail-layout';
import { ProjectCompactHeader } from '@/app/admin/(dashboard)/projects/[id]/components/project-compact-header';
import { ProjectDetailsEditor } from '@/app/admin/(dashboard)/projects/[id]/components/project-details-editor';
import { ProjectBreadcrumbs } from '@/app/admin/(dashboard)/projects/[id]/components/project-breadcrumbs';
import type { ProjectFormData } from '@/lib/validators/project';

type ProjectDetailControllerProps = {
  projectData: ProjectFormData & { id: string };
  onSave: (patch: Partial<ProjectFormData>) => Promise<void>;
  onImageUpload?: (file: File) => Promise<void>;
  onImageRemove?: (url: string) => Promise<void>;
};

export const ProjectDetailController: FC<ProjectDetailControllerProps> = ({
  projectData,
  onSave,
  onImageUpload,
  onImageRemove
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingData, setPendingData] = useState<Partial<ProjectFormData>>({});

  const handleEditToggle = (editing: boolean) => {
    if (!editing) {
      setPendingData({});
    }
    setIsEditing(editing);
  };

  const handleDataChange = (data: Partial<ProjectFormData>) => {
    setPendingData(prev => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const patch: Partial<ProjectFormData> = {};
      for (const key of [
        'name','slug','type','target_budget','status','featured','producer_id','description','long_description','images'
      ] as const) {
        if (key in pendingData && (projectData as any)[key] !== (pendingData as any)[key]) {
          (patch as any)[key] = (pendingData as any)[key];
        }
      }

      if (Object.keys(patch).length > 0) {
        await onSave(patch);
      }

      setIsEditing(false);
      setPendingData({});
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (onImageUpload) {
      try {
        await onImageUpload(file);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleImageRemove = async (url: string) => {
    if (onImageRemove) {
      try {
        await onImageRemove(url);
      } catch (error) {
        console.error('Error removing image:', error);
      }
    } else {
      const currentImages = displayData.images || [];
      const newImages = currentImages.filter((img: string) => img !== url);
      handleDataChange({ images: newImages });
    }
  };

  const displayData = { ...projectData, ...pendingData };

  return (
    <ProjectDetailLayout
      header={
        <>
          <ProjectBreadcrumbs projectData={projectData} />
          <ProjectCompactHeader
            projectData={displayData}
            isEditing={isEditing}
            onEditToggle={handleEditToggle}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </>
      }
      toolbar={<div />}
      content={
        <ProjectDetailsEditor
          projectData={displayData}
          isEditing={isEditing}
          isSaving={isSaving}
          onSave={async (data) => {
            const patch: Partial<ProjectFormData> = {};
            for (const key of [
              'name','slug','type','target_budget','status','featured','producer_id','description','long_description','images'
            ] as const) {
              if ((data as any)[key] !== undefined && (projectData as any)[key] !== (data as any)[key]) {
                (patch as any)[key] = (data as any)[key];
              }
            }

            if (Object.keys(patch).length > 0) {
              await onSave(patch);
            }
            setIsEditing(false);
          }}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
        />
      }
    />
  );
};
