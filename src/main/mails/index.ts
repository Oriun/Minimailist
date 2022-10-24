import { IpcMain, ipcRenderer } from 'electron';
import { getMail, getMails } from './imap';

function MailService(ipcMain: IpcMain): void {
  ipcMain.handle('get-mails', (_, ...rest: Parameters<typeof getMails>) =>
    getMails(...rest)
  );
  ipcMain.handle('get-mail', (_, ...rest: Parameters<typeof getMail>) =>
    getMail(...rest)
  );
}

export const MailBridge = {
  getMails(...rest: Parameters<typeof getMails>) {
    return ipcRenderer.invoke('get-mails', ...rest);
  },
  getMail(id: string) {
    return ipcRenderer.invoke('get-mail', id);
  },
};

export default MailService;
