const dateFormat = new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' });
const dateTimeFormat = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

export const formatDate = (date: Date): string => dateFormat.format(date);
export const formatDateTime = (date: Date): string => dateTimeFormat.format(date);
