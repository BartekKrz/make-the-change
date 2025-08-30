/**
 * Utilitaires de formatage pour Make the CHANGE
 */

// Formatage des prix selon votre documentation (EUR)
export const formatPrice = (amount: number, currency = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Formatage des points selon votre système de récompenses
export const formatPoints = (points: number): string => {
  if (points >= 1000000) {
    return `${(points / 1000000).toFixed(1)}M pts`;
  }
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}k pts`;
  }
  return `${points} pts`;
};

// Formatage des pourcentages (pour les retours d'investissement)
export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

// Formatage des dates en français
export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat('fr-FR', { ...defaultOptions, ...options }).format(date);
};

// Formatage des dates relatives (il y a X jours)
export const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Aujourd\'hui';
  if (diffInDays === 1) return 'Hier';
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
  if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
  if (diffInDays < 365) return `Il y a ${Math.floor(diffInDays / 30)} mois`;
  
  return `Il y a ${Math.floor(diffInDays / 365)} ans`;
};

// Formatage des noms complets
export const formatFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

// Formatage des adresses
export const formatAddress = (address: {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}): string => {
  return `${address.street}, ${address.postalCode} ${address.city}, ${address.country}`;
};
