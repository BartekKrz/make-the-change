export const formatEmail = (email: string) => {
  if (!email) return 'Aucun email';
  return email.toLowerCase();
};

export const formatDate = (date: string | Date) => {
  if (!date) return 'Date non définie';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatCurrency = (amount: number | null | undefined) => {
  if (!amount) return '0 €';
  return `${amount.toFixed(2)} €`;
};

export const formatPercentage = (value: number | null | undefined) => {
  if (!value) return '0%';
  return `${value.toFixed(1)}%`;
};

export const getInitials = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) return '?';
  const first = firstName?.charAt(0).toUpperCase() || '';
  const last = lastName?.charAt(0).toUpperCase() || '';
  return `${first}${last}` || '?';
};

export const formatName = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) return 'Nom non défini';
  return `${firstName || ''} ${lastName || ''}`.trim();
};

export const truncateText = (text: string, maxLength: number = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength))}...`;
};
