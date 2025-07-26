const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'UTC' }
);
const dateTimeFormat = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});
const dateShortFormat = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  timeZone: 'UTC',
});
const weekdayShortFormat = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'short',
  timeZone: 'UTC',
});

export const formatDate = (date: Date): string => dateFormat.format(date);
export const formatDateTime = (date: Date): string => dateTimeFormat.format(date);
export const formatDateShort = (date: Date): string => dateShortFormat.format(date);
export const formatWeekdayShort = (date: Date): string => weekdayShortFormat.format(date);
