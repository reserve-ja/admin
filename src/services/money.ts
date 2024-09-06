const brlFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export const formatMoney = (value: number) => brlFormat.format(value);
