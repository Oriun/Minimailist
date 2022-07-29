export type Mail = {
  id: string;
  date: string;
  object: string;
  time: string;
  timestamp: number;
  from: string;
  tags: { color: string; text: string }[];
};

export type RawMail = {
  id: string;
  from: string;
  to: string;
  object: string;
  date: string;
  body: string;
  tags: { color: string; text: string }[];
};

export enum PERIODS {
  TODAY = "aujourd'hui",
  YESTERDAY = 'hier',
  THIS_WEEK = 'cette semaine',
  THIS_MONTH = 'ce mois-ci',
  THREE_MONTHS = '3 derniers mois',
  OLDER = 'plus anciens',
}

export type MailByPeriod = {
  [key in PERIODS]: Mail[];
};
