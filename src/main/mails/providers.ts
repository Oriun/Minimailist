export type MailProvider = {
  host: string;
  port: number;
  tls: boolean;
};
export const Ionos: MailProvider = {
  host: 'imap.ionos.fr',
  port: 993,
  tls: true,
};
// export const Orange: MailProvider = {
//   host: 'imap.orange.fr',
//   port: 993,
//   tls: true,
// };
// export const Google: MailProvider = {
//   host: 'imap.gmail.com',
//   port: 993,
//   tls: true,
// };
// export const Outlook: MailProvider = {
//   host: 'office365.com',
//   port: 993,
//   tls: true,
// };
