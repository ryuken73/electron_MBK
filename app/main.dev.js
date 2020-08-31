/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, screen } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import path from 'path';
// const path = require('path')

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('browser-window-created', (event, window) =>  {
  window.webContents.on('did-finish-load', () => window.focus())
})

app.on('ready', async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }
  const {width,height} = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    show: false,
    width: width,
    height: height,
    backgroundColor: '#252839',
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true
    }
  }); 

  const session = mainWindow.webContents.session;
  session.on('will-download', (event, item, webContents) => {
      console.log('downloading!!!')
      // event.preventDefault()
      const fname = item.getFilename();
      const downloadFname = "d:\\temp\\" + fname;
      item.setSavePath(downloadFname)

      const id = item.getStartTime();
      const url = item.getURL();
      const savePath = item.getSavePath();
      const totalBytes = item.getTotalBytes();
      const startDateString = new Date().toLocaleDateString();
      const itemInfo = {
        id, 
        url, 
        fname,
        savePath, 
        totalBytes,
        receivedBytes:0,
        status:'started',
        downloadStartTime: Date.now(),
      }
      mainWindow.webContents.send('downloadStarted', itemInfo);
  
      item.on('updated', (event, state) => {
        if (state === 'interrupted') {
          console.log('Download is interrupted but can be resumed');
          mainWindow.webContents.send('downloadStatusChanged', {id, status:'interrupted'});
        } else if (state === 'progressing') {
          if (item.isPaused()) {
              console.log('Download is paused')
          mainWindow.webContents.send('downloadStatusChanged', {id, status:'paused'});
          } else {
              const receivedBytes = item.getReceivedBytes();
              console.log(`Received bytes: ${receivedBytes}`)
              mainWindow.webContents.send('downloadProgress', {id, receivedBytes});
          }
        }
      })
      item.once('done', (event, state) => {
        if (state === 'completed') {
          mainWindow.webContents.send('downloadStatusChanged', {id, status:'completed'});
          console.log('Download successfully')
        } else {
          mainWindow.webContents.send('downloadStatusChanged', {id, status:'faild'});
          console.log(`Download failed: ${state}`)
        }
      })  
  })

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.webContents.on('new-window', ([...args]) => console.log(args));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
});
