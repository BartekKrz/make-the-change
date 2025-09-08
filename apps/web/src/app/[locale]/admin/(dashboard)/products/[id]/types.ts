// Types partagés pour les composants de détail produit

export type SaveStatus = 
  | { type: 'pristine'; message: string }
  | { type: 'saving'; message: string }
  | { type: 'saved'; message: string; timestamp: Date }
  | { type: 'modified'; message: string; count: number; fields: string[] }
  | { type: 'error'; message: string; retryable: boolean };