'use client';

import { useState } from 'react';
import { type FC } from 'react';

import { UserBreadcrumbs } from '@/app/[locale]/admin/(dashboard)/users/[id]/components/user-breadcrumbs';
import { UserCompactHeader } from '@/app/[locale]/admin/(dashboard)/users/[id]/components/user-compact-header';
import { UserDetailLayout } from '@/app/[locale]/admin/(dashboard)/users/[id]/components/user-detail-layout';
import { UserDetailsEditor } from '@/app/[locale]/admin/(dashboard)/users/[id]/components/user-details-editor';

type UserData = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  is_active: boolean;
};

type UserDetailControllerProps = {
  userData: UserData;
  onSave: (patch: Partial<UserData>) => Promise<void>;
};

export const UserDetailController: FC<UserDetailControllerProps> = ({
  userData,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingData, setPendingData] = useState<Partial<UserData>>({});

  const handleEditToggle = (editing: boolean) => {
    if (!editing) {
      setPendingData({});
    }
    setIsEditing(editing);
  };

  const handleDataChange = (data: Partial<UserData>) => {
    setPendingData(prev => ({ ...prev, ...data }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const patch: Partial<UserData> = {};
      for (const key of ['name', 'email', 'role', 'is_active'] as const) {
        if (
          key in pendingData &&
          (userData as any)[key] !== (pendingData as any)[key]
        ) {
          (patch as any)[key] = (pendingData as any)[key];
        }
      }

      if (Object.keys(patch).length > 0) {
        await onSave(patch);
      }

      setIsEditing(false);
      setPendingData({});
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const displayData = { ...userData, ...pendingData };

  return (
    <UserDetailLayout
      toolbar={<div />}
      content={
        <UserDetailsEditor
          isEditing={isEditing}
          isSaving={isSaving}
          userData={displayData}
          onSave={async data => {
            const patch: Partial<UserData> = {};
            for (const key of ['name', 'email', 'role', 'is_active'] as const) {
              if (
                (data as any)[key] !== undefined &&
                (userData as any)[key] !== (data as any)[key]
              ) {
                (patch as any)[key] = (data as any)[key];
              }
            }

            if (Object.keys(patch).length > 0) {
              await onSave(patch);
            }
            setIsEditing(false);
          }}
        />
      }
      header={
        <>
          <UserBreadcrumbs userData={userData} />
          <UserCompactHeader
            isEditing={isEditing}
            isSaving={isSaving}
            userData={displayData}
            onEditToggle={handleEditToggle}
            onSave={handleSave}
          />
        </>
      }
    />
  );
};
