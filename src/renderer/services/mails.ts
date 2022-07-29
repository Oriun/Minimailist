import dayjs from 'dayjs';
import { Mail, MailByPeriod, PERIODS, RawMail } from '../types';

const TIME_REFERENCES = {
  TODAY: dayjs().startOf('day'),
  YESTERDAY: dayjs().subtract(1, 'day').startOf('day'),
  THIS_WEEK: dayjs().startOf('week'),
  THIS_MONTH: dayjs().startOf('month'),
  THREE_MONTHS: dayjs().subtract(3, 'month').startOf('month'),
};

function parseMails(mails: RawMail[]): MailByPeriod {
  return mails
    .map((mail) => {
      const asDayJs = dayjs(mail.date);
      const timestamp = asDayJs.unix() * 1000;
      return {
        ...mail,
        timestamp,
        date: asDayJs.format('DD MMM YYYY'),
        time: asDayJs.format('HH[h]mm'),
      } as Mail;
    })
    .sort((a, b) => b.timestamp - a.timestamp)
    .reduce(
      (prev, cur) => {
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
}

export const getMails = async (): Promise<MailByPeriod> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return electron
    .getMails()
    .then((mails: RawMail[]) => {
      return parseMails(mails);
    })
    .catch((err: Error) => {
      console.error(err);
    });
};

export default getMails;
