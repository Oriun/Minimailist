import { IpcMain, ipcRenderer } from 'electron';
import { getMails } from './imap';

function MailService(ipcMain: IpcMain): void {
  ipcMain.handle('get-mails', getMails);
}

export const MailBridge = {
  getMails() {
    return ipcRenderer.invoke('get-mails');
  },
};

export default MailService;
