const net = require('net');

class Connect {
  private server: string = 'alumchat.xyz';
  private port: number = 5222;
  private socket: any;

  // class constructor
  constructor() {
    this.createConnection();

    this.socket.on('data', (data: any) => {
        console.log("**************************************************\n\n");
        console.log('Received: ' + data.toString());
        this.socketDataHandler(data);
        console.log("**************************************************\n\n");

    });
  }

  public createConnection(): void {
    this.socket = net.createConnection(this.port, this.server, () => {
      console.log('Connected to XMPP server');
      // Send the initial XML stream headers
      this.socket.write(
        `<?xml version="1.0" encoding="UTF-8"?>` +
        `<stream:stream xmlns="jabber:client" xmlns:stream="http://etherx.jabber.org/streams" to="${this.server}" version="1.0">`
      );
    });
  }

  public socketDataHandler(data: any): void {
    if(data.includes("'type='result' id='auth1'")) {
       // login request response
         console.log("login request response");
    }
  }

  public login(username: string, password: string): void {
    const loginRequest = `<iq type='set' id='auth1'>
      <query xmlns='jabber:iq:auth'>
          <username>${username}</username>
          <password>${password}</password>
            <resource>XMPPPro</resource>
      </query>
  </iq>`;

    this.socket.write(loginRequest);
  }
}

export default Connect;
