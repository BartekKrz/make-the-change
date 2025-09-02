// Types partagés pour les composants de détail produit

export type SaveStatus = {
  type: 'idle' | 'saving' | 'pending' | 'saved' | 'error';
  message: string;
  count?: number;
};