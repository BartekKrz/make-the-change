import { redirect } from 'next/navigation';

export default function RootPage() {
  // Rediriger automatiquement vers la locale par défaut
  redirect('/fr');
}
