import dayjs from 'dayjs';
import { Mail, MailByPeriod, PERIODS } from '../types';

enum DURATION {
  MONTH = 60 * 60 * 24 * 30 * 1000,
}

function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}
function randomString(length: number, extended?: boolean): string {
  let result = '';
  let characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789aaaaaeeeeeiiiiioooouuuullllsssrrLLLLLUUUUUUAAAAAEEEEEIIIIOOOOUUUUU';
  if (extended)
    characters +=
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789aaaaaeeeeeiiiiioooouuuullllsssrrLLLLLUUUUUUAAAAAEEEEEIIIIOOOOUUUUU                                                       -'()?!.:;,&@éèàç";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function randomChoice<T>(choices: T[]): T {
  return choices[Math.floor(Math.random() * choices.length)];
}

function randomSubArray<T>(array: T[], max?: number): T[] {
  const length =
    1 + randomInt((max ? Math.min(max, array.length) : array.length) - 1);
  const result: T[] = [];
  for (let i = 0; i < length; i += 1) {
    const choice = randomChoice(array);
    if (!result.find((a) => JSON.stringify(a) === JSON.stringify(choice)))
      result.push(choice);
    else i -= 1;
  }
  return result;
}
enum COLORS {
  CornflowerBlue = '#4361EE',
  PictonBlue = '#4CC9F0',
  VioletRed = '#F72585',
  Purple = '#7209B7',
  Ultramarine = '#3A0CA3',
  Amber = '#F3B700',
  Black = '#000000',
}
const Taglist = [
  { color: COLORS.VioletRed, text: 'Very-long-taaaaaaaaag' },
  { color: COLORS.VioletRed, text: 'Very-long-taaaaaaaaag' },
  { color: COLORS.VioletRed, text: 'Very-long-taaaaaaaaag' },
  { color: COLORS.VioletRed, text: 'Very-long-taaaaaaaaag' },
  { color: COLORS.VioletRed, text: 'Very-long-taaaaaaaaag' },
  { color: COLORS.CornflowerBlue, text: 'Urgent' },
  { color: COLORS.CornflowerBlue, text: 'Urgent' },
  { color: COLORS.CornflowerBlue, text: 'Urgent' },
  { color: COLORS.VioletRed, text: 'Important' },
  { color: COLORS.Ultramarine, text: 'Work' },
  { color: COLORS.Ultramarine, text: 'Work' },
  { color: COLORS.Ultramarine, text: 'Work' },
  { color: COLORS.Ultramarine, text: 'Work' },
  { color: COLORS.Ultramarine, text: 'Work' },
  { color: COLORS.Ultramarine, text: 'Work' },
  { color: COLORS.Ultramarine, text: 'Work' },
  { color: COLORS.Ultramarine, text: 'Work' },
  { color: COLORS.Ultramarine, text: 'Work' },
  { color: COLORS.CornflowerBlue, text: 'Personal' },
  { color: COLORS.CornflowerBlue, text: 'Personal' },
  { color: COLORS.CornflowerBlue, text: 'Personal' },
  { color: COLORS.CornflowerBlue, text: 'Personal' },
  { color: COLORS.CornflowerBlue, text: 'Personal' },
  { color: COLORS.CornflowerBlue, text: 'Personal' },
  { color: COLORS.CornflowerBlue, text: 'Personal' },
  { color: COLORS.CornflowerBlue, text: 'Personal' },
  { color: COLORS.Amber, text: 'Family' },
  { color: COLORS.Purple, text: 'Club-de-golf' },
  { color: COLORS.Purple, text: 'Club-de-golf' },
  { color: COLORS.Purple, text: 'Club-de-golf' },
  { color: COLORS.Purple, text: 'Club-de-golf' },
  { color: COLORS.Amber, text: 'Friends' },
  { color: COLORS.PictonBlue, text: 'Travel' },
  { color: COLORS.PictonBlue, text: 'Holidays' },
  { color: COLORS.Black, text: 'Spam' },
  { color: COLORS.Black, text: 'Spam' },
  { color: COLORS.Black, text: 'Spam' },
  { color: COLORS.Black, text: 'Spam' },
  { color: COLORS.Black, text: 'Spam' },
];

function randomMail(_: any, i: number): Mail {
  const timestamp = Date.now() - randomInt(4 * DURATION.MONTH * (i / 100) ** 2);
  const from = `${randomString(3 + randomInt(16))}@${randomString(
    3 + randomInt(8)
  )}.com`.toLowerCase();
  const mail: Mail = {
    timestamp,
    date: new Date(timestamp).toLocaleDateString(),
    time: new Date(timestamp).toLocaleTimeString(),
    id: '',
    object: randomString(randomInt(40) + 10, true),
    from,
    tags: randomSubArray(Taglist, 4).sort((a, b) =>
      a.text.localeCompare(b.text, 'fr', { sensitivity: 'base', numeric: true })
    ),
  };

  return mail;
}

const TIME_REFERENCES = {
  TODAY: dayjs().startOf('day'),
  YESTERDAY: dayjs().subtract(1, 'day').startOf('day'),
  THIS_WEEK: dayjs().startOf('week'),
  THIS_MONTH: dayjs().startOf('month'),
  THREE_MONTHS: dayjs().subtract(3, 'month').startOf('month'),
};

const mails = Array.from({ length: 300 }, randomMail)
  .sort((a, b) => b.timestamp - a.timestamp)
  .reduce(
    (prev, cur, index) => {
      cur.id = (429 - index).toString();
      if (TIME_REFERENCES.TODAY.isBefore(cur.timestamp)) {
        cur.date = "Aujourd'hui";
        prev[PERIODS.TODAY].push(cur);
      } else if (TIME_REFERENCES.YESTERDAY.isBefore(cur.timestamp)) {
        cur.date = 'Hier';
        prev[PERIODS.YESTERDAY].push(cur);
      } else if (TIME_REFERENCES.THIS_WEEK.isBefore(cur.timestamp)) {
        prev[PERIODS.THIS_WEEK].push(cur);
      } else if (TIME_REFERENCES.THIS_MONTH.isBefore(cur.timestamp)) {
        prev[PERIODS.THIS_MONTH].push(cur);
      } else if (TIME_REFERENCES.THREE_MONTHS.isBefore(cur.timestamp)) {
        prev[PERIODS.THREE_MONTHS].push(cur);
      } else {
        prev[PERIODS.OLDER].push(cur);
      }
      return prev;
    },
    {
      [PERIODS.TODAY]: [] as Mail[],
      [PERIODS.YESTERDAY]: [] as Mail[],
      [PERIODS.THIS_WEEK]: [] as Mail[],
      [PERIODS.THIS_MONTH]: [] as Mail[],
      [PERIODS.THREE_MONTHS]: [] as Mail[],
      [PERIODS.OLDER]: [] as Mail[],
    }
  ) as MailByPeriod;

export default mails;
