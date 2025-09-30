'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';

import { UserDetailController } from '@/app/[locale]/admin/(dashboard)/users/[id]/components/user-detail-controller';
import { trpc } from '@/lib/trpc';

import type { FC } from 'react';

const AdminUserEditPage: FC = () => {
  const params = useParams<{ id: string }>();
  const userId = params?.id as string;
  const utils = trpc.useUtils();

  const {
    data: user,
    isLoading,
    error,
  } = trpc.admin.users.detail.useQuery(
    { userId },
    {
      enabled: !!userId,
      retry: 1,
      retryDelay: 500,
    }
  );

  const userData = useMemo(() => {
    if (!user) return null;

    return {
      id: user.id,
      name: user.email.split('@')[0],
      email: user.email,
      role: (user.user_level === 'ambassadeur' ? 'admin' : 'user') as
        | 'admin'
        | 'user',
      is_active: true,
      user_level: user.user_level,
      points_balance: user.points_balance,
      kyc_status: user.kyc_status,
      kyc_level: user.kyc_level,
    };
  }, [user]);

  const update = trpc.admin.users.update.useMutation({
    onMutate: async vars => {
      await utils.admin.users.detail.cancel({ userId });
      await utils.admin.users.list.cancel();

      const prevDetail = utils.admin.users.detail.getData({ userId });
      const prevList = utils.admin.users.list.getData();

      if (prevDetail) {
        utils.admin.users.detail.setData(
          { userId },
          { ...prevDetail, ...vars.patch }
        );
      }

      if (prevList) {
        utils.admin.users.list.setData(undefined, {
          ...prevList,
          items: prevList.items.map(u =>
            u.id === vars.userId ? { ...u, ...vars.patch } : u
          ),
        });
      }

      return { prevDetail, prevList };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.prevDetail) {
        utils.admin.users.detail.setData({ userId }, ctx.prevDetail);
      }
      if (ctx?.prevList) {
        utils.admin.users.list.setData(undefined, ctx.prevList);
      }
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la sauvegarde');
    },
    onSettled: () => {
      utils.admin.users.detail.invalidate({ userId });
      utils.admin.users.list.invalidate();
    },
  });

  const handleSave = async (patch: any) => {
    if (!userId) return;

    try {
      await update.mutateAsync({
        userId,
        patch,
      });
      console.warn('Updating user:', { id: userId, patch });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  if (!userId) return <div className="p-8">Missing userId</div>;
  if (isLoading && !userData) return <div className="p-8">Chargement…</div>;
  if (!userData) return <div className="p-8">Utilisateur non trouvé</div>;

  return <UserDetailController userData={userData} onSave={handleSave} />;
};

export default AdminUserEditPage;
