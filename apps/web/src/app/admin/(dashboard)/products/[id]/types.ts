// Types partagés pour les composants de détail produit

export type SaveStatus = {
  type: 'pristine' | 'modified' | 'saving' | 'saved' | 'error';
  message: string;
  count?: number;
  timestamp?: number; // Pour gérer l'auto-hide du succès
};