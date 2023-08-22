/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import Connect from './XMPP/Connect';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 1024,
    minHeight: 728,
    fullscreenable: true,
    icon: getAssetPath('icon.png'),
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#1d1d1d',
      symbolColor: '#6b8afd',
      
    },
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
      // devTools: false,
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));
  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  const connect = new Connect(mainWindow);

  // METHODS

  ipcMain.on('login', (event, arg) => {
    console.log(arg);
    login(arg.username, arg.password);
  });

  ipcMain.on('register', (event, arg) => {
    console.log(arg);
    register(arg.username, arg.password);
  });



  // EVENTS
  // get contacts
  ipcMain.on('getContacts', (event, arg) => {
    console.log(arg);
    console.log('getContacts');
    connect.getContacts();
  });

  // add contact
  ipcMain.on('addContact', (event, arg) => {
    console.log(arg);
    console.log('addContact');
    connect.addContact(arg.username);
  });

  // get requests
  ipcMain.on('getRequests', (event, arg) => {
    console.log(arg);
    console.log('getRequests');
    let requests = connect.getRequests();
    console.log(requests);
    return requests;
  });

  // logout
  ipcMain.on('logout', (event, arg) => {
    console.log(arg);
    console.log('logout');
    connect.logout();
  });


  // accept request
  ipcMain.on('acceptRequest', (event, arg) => {
    console.log(arg);
    console.log('acceptRequest');
    connect.acceptRequest(arg.username);
  });


  // sendMessage
  ipcMain.on('sendMessage', (event, arg) => {
    console.log(arg);
    console.log('sendMessage');
    let { message, to, timeStamp, fromLocal} = arg;
    connect.sendMessage(message, to, timeStamp, fromLocal);
  });



  // show info
  ipcMain.on('showInfo', (event, arg) => {
    console.log(arg);
    console.log('showInfo');
    // connect.showInfo(arg.JID);
  });



  // send file
  ipcMain.on('sendFile', (event, arg) => {
    const { dialog } = require('electron')
    let { JID } = arg;
    dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }).then((result: any) => {
      console.log(result.filePaths)
      console.log('sendFile');
      connect.sendFile(JID, result.filePaths);
    }
    ).catch((err: any) => {
      console.log(err)
    }
    )
  });


  ipcMain.on("removeAccount", (event, arg) => {
    console.log(arg);
    console.log('removeAccount');
    connect.removeAccount();

  })  



  const login = (username: string, password: string) => {
    connect.login(username, password);
  };

  const register = (username: string, password: string) => {
    connect.register(username, password);
  };

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
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

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
