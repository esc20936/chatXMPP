process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const net = require('net');
const { client, xml } = require('@xmpp/client');
import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';


export default class Connect {
  private server: string = 'alumchat.xyz';
  private port: number = 5222;
  private socket: any;
  private service: string = 'xmpp://alumchat.xyz:5222';
  private xmppClient: any;


  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    console.log('Connect constructor');
    console.log(this.mainWindow);
    
  }



  public login(username: string, password: string) {
    this.xmppClient = client({
      service: 'xmpp://alumchat.xyz:5222',
      domain: 'alumchat.xyz',
      resource: '',
      username: username,
      password: password,
    });

    this.subscribeToEvents();
    this.xmppClient.start().catch((err: any) => {
      console.log("Error: Couldn't connect to server");
      console.log(err);
    });
  }

  private subscribeToEvents() {
    // error handling
    this.xmppClient.on('error', (err: any) => {
      this.errorHandler(err);
    });

    // offline handling
    this.xmppClient.on('offline', () => {
      this.offlineHandler();
    });

    // online handling
    this.xmppClient.on('online', (address: any) => {
      this.onlineHandler(address);
      
    });

    // stanza handling
    this.xmppClient.on('stanza', (stanza: any) => {
      this.stanzaHandler(stanza);
    });
  }

  private async onlineHandler(address: any) {
    await this.xmppClient.send(xml('presence'));
    console.log('online as', address.toString());
    this.mainWindow.webContents.send('login_success', address.toString());
    
  }

  private async stanzaHandler(stanza: any) {
    if (stanza.is('message')) {
      console.log('Received message: ' + stanza.getChildText('body'));
    } else {
      console.log('Received stanza: ', stanza.toString());
    }
  }

  private errorHandler(err: any) {
    console.log('\n\n');
    console.log('*********************** ERROR ***********************');
    console.log(err.name);
    this.errorManager(err);
    console.log('*****************************************************');
    console.log('\n\n');
  }


  private errorManager(err: any) {
    switch (err.name) {
      case "SASLError":
        // No se pudo autenticar
        console.log("Error: Couldn't authenticate");
        this.mainWindow.webContents.send('login_failure', "Couldn't authenticate");
        break;
    }


  }




  private offlineHandler() {
    console.log('\n\n');
    console.log('*********************** OFFLINE ***********************');
    console.log('You are offline');
    console.log('*******************************************************');
    console.log('\n\n');
  }
}
