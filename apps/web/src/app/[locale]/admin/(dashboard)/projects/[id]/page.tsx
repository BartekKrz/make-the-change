'use client';

import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { type FC } from 'react';

import { ProjectDetailController } from '@/app/[locale]/admin/(dashboard)/projects/[id]/components/project-detail-controller';
import { trpc } from '@/lib/trpc';
import { supabase } from '@/supabase/client';

const AdminProjectEditPage: FC = () => {
  const params = useParams<{ id: string }>();
  const projectId = params?.id as string;
  const utils = trpc.useUtils();

  const {
    data: project,
    isLoading,
    error,
  } = trpc.admin.projects.byId.useQuery(
    { id: projectId! },
    {
      enabled: !!projectId,
      retry: 1,
      retryDelay: 500,
    }
  );
  const update = trpc.admin.projects.update.useMutation({
    onMutate: async vars => {
      await utils.admin.projects.byId.cancel({ id: projectId! });
      await utils.admin.projects.list.cancel();

      const prevDetail = utils.admin.projects.byId.getData({ id: projectId! });
      const prevList = utils.admin.projects.list.getData();

      if (prevDetail) {
        utils.admin.projects.byId.setData(
          { id: projectId! },
          { ...prevDetail, ...vars.patch }
        );
      }

      if (prevList) {
        utils.admin.projects.list.setData(undefined, {
          ...prevList,
          items: prevList.items.map(p =>
            p.id === projectId ? { ...p, ...vars.patch } : p
          ),
        });
      }

      return { prevDetail, prevList };
    },
    onError: (error, _vars, ctx) => {
      if (ctx?.prevDetail) {
        utils.admin.projects.byId.setData({ id: projectId! }, ctx.prevDetail);
      }
      if (ctx?.prevList) {
        utils.admin.projects.list.setData(undefined, ctx.prevList);
      }
      console.error('Erreur lors de la mise à jour:', error);
      alert('Erreur lors de la sauvegarde');
    },
    onSettled: () => {
      utils.admin.projects.byId.invalidate({ id: projectId! });
      utils.admin.projects.list.invalidate();
    },
  });

  const projectData = useMemo(() => {
    return project || null;
  }, [project]);

  if (!projectId) return <div className="p-8">Missing projectId</div>;
  if (isLoading && !projectData) return <div className="p-8">Chargement…</div>;
  if (!projectData) return <div className="p-8">Projet non trouvé</div>;

  const handleSave = async (patch: any) => {
    if (project) {
      update.mutate({ id: projectId, patch });
    } else {
      console.warn('Mode mock - sauvegarde simulée:', patch);
      alert('Sauvegarde simulée (mode développement)');
    }
  };

  const handleImageUpload = async (file: File) => {
    const bucket = 'project-images';
    const path = `${projectId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    if (error) {
      alert(`Upload échoué: ${error.message}`);
      throw error;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    const url = data.publicUrl;
    const currentImages = projectData.images || [];
    const newImages = [...currentImages, url];
    await handleSave({ images: newImages });
  };

  const handleImageRemove = async (url: string) => {
    const currentImages = projectData.images || [];
    const newImages = currentImages.filter((img: string) => img !== url);
    await handleSave({ images: newImages });
  };

  return (
    <ProjectDetailController
      projectData={projectData}
      onImageRemove={handleImageRemove}
      onImageUpload={handleImageUpload}
      onSave={handleSave}
    />
  );
};
export default AdminProjectEditPage;
