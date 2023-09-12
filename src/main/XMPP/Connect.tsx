process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const net = require('net');
const { client, xml, jid } = require('@xmpp/client');
import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';
const Flooding = require('../../../Algorithms/flooding');

export default class Connect {
  private server: string = 'alumchat.xyz';
  private port: number = 5222;
  private service: string = 'xmpp://alumchat.xyz:5222';
  private xmppClient: any;
  private username: string;
  private names = require('./names.json');
  private topologia = require('./topo.json');
  private topo: any;
  private floodRouter: any;
  private arrayRequests: string[] = [];
  private strategy: string = 'flooding';
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.topo = this.createUpdatedTopology(this.names, this.topologia);
    console.log('Connect constructor');
    console.log(this.mainWindow);
  }

  public createUpdatedTopology(nameMapping: any, originalTopology: any) {
    const updatedTopology = { ...originalTopology };

    for (const oldKey in nameMapping.config) {
      const newKey = nameMapping.config[oldKey];
      if (updatedTopology.config[oldKey]) {
        updatedTopology.config[newKey] = updatedTopology.config[oldKey];
        delete updatedTopology.config[oldKey];
        updatedTopology.config[newKey] = updatedTopology.config[newKey].map(
          (item) => {
            return nameMapping.config[item] || item;
          }
        );
      }
    }

    return updatedTopology;
  }

  public login(username: string, password: string) {
    this.username = username;
    this.floodRouter = new Flooding(username + '@alumchat.xyz', this.topo);

    this.xmppClient = client({
      service: 'xmpp://alumchat.xyz:5222',
      domain: 'alumchat.xyz',
      resource: '',
      username: username,
      password: password,
      tls: {
        rejectUnauthorized: false,
      },
    });

    this.subscribeToEvents();
    this.xmppClient.start().catch((err: any) => {
      console.log("Error: Couldn't connect to server");
      console.log(err);
    });
  }

  public register(username: string, password: string) {
    const socket = net.createConnection(this.port, this.server, () => {
      console.log('Connected to XMPP server');

      // Send the initial XML stream headers
      socket.write(
        `<?xml version="1.0" encoding="UTF-8"?>` +
          `<stream:stream xmlns="jabber:client" xmlns:stream="http://etherx.jabber.org/streams" to="${this.server}" version="1.0">`
      );
    });

    socket.on('data', (data: any) => {
      const response = data.toString();

      console.log('Received:', response);

      // if response contains iq type="result" id="reg1" then registration was successful
      if (response.includes('iq type="result" id="reg1"')) {
        console.log('Registration successful');

        this.mainWindow.webContents.send(
          'register_success',
          'Registration successful'
        );
      } else if (response.includes('iq type="error" id="reg1"')) {
        console.log('Registration failed');
        this.mainWindow.webContents.send(
          'register_failure',
          'Registration failed'
        );

        // fake print sending message to node pablo123@alumchat.xyv
        // passing by eduardo123@alumchat
      }
      // Process the received data
      // ...

      // Example: Send a registration request
      if (response.includes('<stream:features>')) {
        const registrationRequest = `<iq type="set" id="reg1">
            <query xmlns="jabber:iq:register">
              <username>${username}</username>
              <password>${password}</password>
            </query>
          </iq>`;

        socket.write(registrationRequest);
      }
    });
  }

  public getContacts() {
    const rq = xml(
      'iq',
      { type: 'get', id: 'roster' },
      xml('query', { xmlns: 'jabber:iq:roster' })
    );

    this.xmppClient
      .send(rq)
      .then((result: any) => {})
      .catch((err: any) => {
        // send error to chat contacts
        console.log('Error: ', err);
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

  private async saveBase64ToFile(base64Data, filePath) {
    const fs = require('fs');
    const fileData = Buffer.from(base64Data, 'base64');
    await fs.promises.writeFile(filePath, fileData);
    console.log(`Archivo guardado en: ${filePath}`);
  }

  private async stanzaHandler(stanza: any) {
    
    if (stanza.is('presence') && stanza.attrs.type === 'subscribe') {
      const from = stanza.attrs.from;
      // send request
      this.mainWindow.webContents.send('request_received', from);

      this.arrayRequests.push(from);
      console.log('Solicitud de amistad recibida de: ', from);

      return;
    }

    // resultados IQ
    if (stanza.is('iq') && stanza.attrs.type === 'result') {
      const query = stanza.getChild('query', 'jabber:iq:roster');
      const contacts = query.getChildren('item');

      this.mainWindow.webContents.send('getContacts_success', contacts);
      
      return;
    }

    if (stanza.is('message') && stanza.attrs.type === 'chat') {
      const from = stanza.attrs.from;
      let body = stanza.getChildText('body');
      const subject = stanza.getChildText('subject');

      if (
        from &&
        body &&
        subject &&
        (subject.includes('Archivo:') || subject.includes('File:'))
      ) {
        console.log('Archivo recibido');
        const fileName = subject.slice(subject.indexOf(':') + 1).trim();
        const base64Data = body.slice(7);
        const filePath = `./${fileName}`;
        // Convertir base64 a archivo y guardarlo
        await this.saveBase64ToFile(base64Data, filePath);

        this.mainWindow.webContents.send('message_received', {
          from: from,
          body: 'Archivo recibido y guardado en\n' + filePath,
          subject: subject,
          message: 'Archivo recibido y guardado en\n' + filePath,
        });

        // console.log(`Archivo recibido de ${from}: ${filePath}`);
      } else {
        // send message to chat
        console.log('Mensaje recibido');
        if (body.includes('file://')) {
          console.log('Archivo recibido');
          const base64Data = body.slice(7);
          const filePath = `./DOWNLOAD`;
          await this.saveBase64ToFile(base64Data, filePath);
          console.log(base64Data.substring(0, 100));
          console.log(`Archivo recibido de ${from}: ${filePath}`);
          this.mainWindow.webContents.send('message_received', {
            from: from,
            body: 'rand says: \nArchivo recibido y guardado en\n' + filePath,
            subject: subject,
            message: 'Archivo recibido y guardado en\n' + filePath,
          });
        } else {
          console.log(body);

          // remove 'Echobot says:\n' from body
          body = body.slice(14);

          
          let { type, headers, payload } = JSON.parse(body);
          let newBody = payload;
          console.log(newBody);

          this.mainWindow.webContents.send('message_received', {
            from: from,
            body: newBody,
            subject: subject,
            message: newBody,
          });
        }
      }
      return;
    }

    if (stanza.is('message')) {
      const { from, type } = stanza.attrs;
      let p = stanza.getChildText('body');

      //console.log("Message received from: ", from)
      //console.log("Message: ", p)

      if (!p) {
        return;
      }

      p = JSON.parse(p);
      //console.log(p.type)
      if (p.type === 'echo') {
        if (p.payload.timestamp2 === '') {
          p.payload.timestamp2 = Date.now().toString();
          this.xmppClient.send(
            xml(
              'message',
              { to: from, type: 'chat' },
              xml('body', {}, JSON.stringify(p))
            )
          );
        } else {
          console.log('RTT: ', p.payload.timestamp2 - p.payload.timestamp1);
        }
      } else if (p.type === 'message') {
        if (this.strategy === 'flooding') {
          const packet = this.floodRouter.flood(p);

          if (packet) {
            const neighbors = this.floodRouter.neighbors;

            neighbors.forEach((n) => {
              if (n === from) {
                return;
              }
              this.xmppClient.send(
                xml(
                  'message',
                  { to: n, type: 'chat' },
                  xml('body', {}, JSON.stringify(packet))
                )
              );
            });
          }
        }
      } else if (p.type === 'topo') {
        this.topo = this.createUpdatedTopology(this.names, p.config);
        this.floodRouter.updateTopology(this.topo);
      } else if (p.type === 'names') {
        this.topo = this.createUpdatedTopology(p.config, this.topo);
        this.floodRouter.updateTopology(this.topo);
      }
    }
  }

  public sendEchoMessage(to: string) {
    // destination should be a jid with @alumchat
    const message = {
      type: 'echo',
      headers: {
        from: this.username + '@alumchat.xyz',
        to,
      },
      payload: {
        timestamp1: Date.now().toString(),
        timestamp2: '',
      },
    };

    this.xmppClient.send(
      xml(
        'message',
        { to, type: 'chat' },
        xml('body', {}, JSON.stringify(message))
      )
    );
  }
  public addContact(username: string) {
    const presence = xml('presence', { to: username, type: 'subscribe' });

    this.xmppClient
      .send(presence)
      .then(() => {
        // send success to chat contacts
        this.mainWindow.webContents.send(
          'addContact_success',
          `Solicitud de suscripción enviada a ${username}`
        );
      })
      .catch((err: any) => {
        // send error to chat contacts
        this.mainWindow.webContents.send(
          'addContact_failure',
          `Error al enviar la solicitud de suscripción: ${err}`
        );
      });
  }

  public getRequests() {
    return this.arrayRequests;
  }

  public async acceptRequest(username: string) {
    await this.xmppClient.send(
      xml('presence', { to: username, type: 'subscribed' })
    );
    console.log(`Accepted subscription request from: ${username}`);

    // remove from array
    this.mainWindow.webContents.send('acceptRequest_success', username);
  }

  private errorHandler(err: any) {
    console.log('\n\n');
    console.log('*********************** ERROR ***********************');
    console.log(err.name);
    this.errorManager(err);
    console.log('*****************************************************');
    console.log('\n\n');
  }

  public async sendMessage(
    message: string,
    to: string,
    timeStamp: string,
    fromLocal: boolean
  ) {
    if (this.strategy === 'flooding') {
      const objectToSend = {
        type: 'message',
        headers: {
          from: this.username + '@alumchat.xyz',
          to,
          hop_count: 0,
        },
        payload: message,
      };

      console.log("\n\n###################\n\n")
      console.log("Enviando mensaje")
      const vecinos = this.floodRouter.neighbors;
      vecinos.forEach((n) => {
        console.log(n);
        this.xmppClient.send(
          xml(
            'message',
            { to: n, type: 'chat' },
            xml('body', {}, JSON.stringify(objectToSend))
          )
        );
      });

    }

    // const rq = xml(
    //   'message',
    //   { type: 'chat', to: to },
    //   xml('body', {}, message)
    // );

    // // Enviar el mensaje al contactoc;casdas
    // await this.xmppClient.send(rq);
  }

  public logout() {
    this.xmppClient.stop();
  }

  private errorManager(err: any) {
    switch (err.name) {
      case 'SASLError':
        // No se pudo autenticar
        console.log("Error: Couldn't authenticate");
        this.mainWindow.webContents.send(
          'login_failure',
          "Couldn't authenticate"
        );
        break;
    }
  }

  public async sendFile(JID: string, path: string) {
    // convert file to base64
    path = path[0];
    console.log(path);
    console.log(JID);
    const fs = require('fs');
    const fileData = fs.readFileSync(path);
    const base64Data = fileData.toString('base64');

    // get filename from path
    const filename = path.split('\\').pop().split('/').pop();

    const message = xml(
      'message',
      { type: 'chat', to: JID },
      xml('body', {}, `file://${base64Data}`),
      xml('subject', {}, `Archivo: ${filename}`)
    );

    // Enviar el mensaje al contacto
    await this.xmppClient.send(message);

    this.mainWindow.webContents.send('file_message_sent', {
      body: 'FILE SENT',
      to: JID,
    });
  }

  public removeAccount() {
    const rq = xml(
      'iq',
      { type: 'set', id: 'unreg1' },
      xml('query', { xmlns: 'jabber:iq:register' }, xml('remove'))
    );

    // Enviando la stanza al servidor XMPP.
    this.xmppClient.send(rq);
  }

  private offlineHandler() {
    console.log('\n\n');
    console.log('*********************** OFFLINE ***********************');
    console.log('You are offline');
    console.log('*******************************************************');
    console.log('\n\n');
  }
}
