import { bold } from 'discord.js';

export const formatMoney = (money: number): string => {
  return `${bold(money.toLocaleString('en-US') + ' $')}`;
};

export const formatMoneyWithoutBold = (money: number): string => {
  return `${money.toLocaleString('en-US') + ' $'}`;
};
