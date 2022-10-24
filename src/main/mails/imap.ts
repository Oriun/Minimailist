import { access, mkdir, readFile, writeFile } from 'fs/promises';
import Imap from 'node-imap';
import { simpleParser } from 'mailparser';
import dayjs from 'dayjs';
import { createThrottle } from '../../utils/throttle';
import { Ionos } from './providers';

const imap = new Imap({
  user: 'emmanuel@nuiro.me',
  password: 'OrIuN-sInDu-StRyE-N0511-00',
  ...Ionos,
});

const ready = new Promise((resolve) => {
  imap.once('ready', resolve);
});

imap.connect();

export type Mail = {
  id: string;
  from: string;
  to: string[];
  object: string;
  date: string;
  body: string;
  tags: { color: string; text: string }[];
};

type FetchBatcherParams = {
  id: number;
};
const FETCH_OPTIONS = {
  bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
  struct: true,
};

const FetchBatcher = createThrottle<FetchBatcherParams, ImapFetchData>(
  async (argsStack, resolveStack) => {
    const ids = argsStack.flat().map((arg) => arg.id);
    console.log(ids.length);
    const f = imap.fetch(ids, FETCH_OPTIONS);
    f.on('message', (msg, seqno) => {
      const mail: ImapFetchData = { body: '', attributes: {}, seqno };
      msg.on('body', async (stream, info) => {
        stream.on('data', (chunk) => {
          mail.body += chunk.toString('utf-8');
        });
      });
      msg.once('attributes', (attrs) => {
        mail.attributes = attrs;
      });
      msg.once('end', () => {
        const index = argsStack.findIndex(
          (arg) => arg[0].id === mail.attributes.uid
        );
        resolveStack[index](mail);
      });
    });
    f.once('error', (error) => {
      console.error(error);
    });
    f.once('end', async () => {
      console.log('Batch ended');
    });
  },
  1_000
);

type ImapFetchData = {
  attributes: {
    [key: string]: any;
  };
  body: string;
  seqno: number;
};

async function fetchMail(id: number): Promise<Mail> {
  const mail = {} as Partial<Mail>;
  console.log(`Fetching mail ${id}`);
  const data = await FetchBatcher({ id });

  const parsed = await simpleParser(data.body);

  // await writeFile(
  //   'mails.json',
  //   `${JSON.stringify({ parsed, attrs: data.attributes }, null, 4)},`,
  //   {
  //     flag: 'a',
  //   }
  // );

  mail.date = parsed.date?.toISOString();
  mail.from = parsed.from?.text;
  mail.id = data.attributes.uid;
  mail.object = parsed.subject;
  mail.to = !parsed.to ? [] : [parsed.to].flat(2).map((to) => to.text);
  mail.tags = [];
  mail.body = parsed.textAsHtml;

  console.log(`Mail ${id} fetched`);
  return mail as Mail;
}

function openBox(box: string) {
  return new Promise<void>((resolve, reject) => {
    imap.openBox(box, true, (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });
}

function search(criteria: unknown[]): Promise<number[]> {
  return new Promise<number[]>((resolve, reject) => {
    imap.search(criteria, (err, results) => {
      if (err) return reject(err);
      return resolve(results);
    });
  });
}

type DateLike = Date | string | number | dayjs.Dayjs;
export const getMails = async ({
  from = dayjs().subtract(2, 'month'),
  to = dayjs().add(2, 'day'),
}: {
  from?: DateLike;
  to?: DateLike;
} = {}) => {
  await mkdir('mails', { recursive: true }).catch(console.log);
  await ready;
  console.time('getMails');
  await openBox('INBOX');
  const ids = await search([
    'ALL',
    ['SINCE', dayjs(from).format('MMMM DD, YYYY')],
    ['BEFORE', dayjs(to).format('MMMM DD, YYYY')],
  ]);
  // await writeFile('mails.json', `[`);
  const mails = await Promise.all(
    ids.map(async (id) => {
      const exists = await access(`mails/${id}.json`).then(
        () => true,
        () => false
      );
      console.log({ exists });
      if (exists) {
        return JSON.parse(await readFile(`mails/${id}.json`, 'utf-8'));
      }
      const mail = await fetchMail(id);
      writeFile(`mails/${id}.json`, JSON.stringify(mail, null, 4), 'utf-8');
      return mail;
    })
  );
  // await writeFile('mails.json', `]`, { flag: 'a' });
  console.timeEnd('getMails');
  console.log('All mails fetched');
  return mails;
};

export const getMail = async (id: number) => {
  await ready;
  const exists = await access(`mails/${id}.json`).then(
    () => true,
    () => false
  );
  if (exists) {
    return JSON.parse(await readFile(`mails/${id}.json`, 'utf-8'));
  }
  const mail = await fetchMail(id);
  writeFile(`mails/${id}.json`, JSON.stringify(mail, null, 4), 'utf-8');
  return mail;
};
