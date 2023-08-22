// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels = 'ipc-example' | "login_success" | "login_failure" | "login"
  | "register" | "register_success" | "register_failure" | "logout" | "logout_success"|
  "getContacts" | "getContacts_success" | "getContacts_failure"|
  "addContact" | "addContact_success" | "addContact_failure"|
  "getRequests" | "getRequests_success" | "getRequests_failure"| "request_received"|
  "acceptRequest" | "acceptRequest_success" | "acceptRequest_failure"|
  "sendMessage"| "removeAccount"|
  "file_message_sent";

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },

  // functions to expose


  // *************************************************************************

  // Login functions

  onLoginSuccess: (callback: any) => {
    const channel: string = 'login_success';
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);

    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  // login_failure
  onLoginFailure: (callback: any) => {
    const channel: string = 'login_failure';
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);

    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  // *************************************************************************

  // Register functions
  
  onRegisterSuccess: (callback: any) => {
    const channel: string = 'register_success';
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>

      callback(...args);

    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  onRegisterFailure: (callback: any) => {
    const channel: string = 'register_failure';
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);

    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  // *************************************************************************

  // addContact functions

  onAddContactSuccess: (callback: any) => {
    const channel: string = 'addContact_success';
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);

    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  onAddContactFailure: (callback: any) => {
    const channel: string = 'addContact_failure';
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);

    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  onGetContacts: (callback: any) => {
    const channel: string = 'getContacts_success';
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>

      callback(...args);

    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  // *************************************************************************

  // onRequest received functions

  onRequestsReceived: (callback: any) => {
    const channel: string = 'request_received';
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);

    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);

    };
  },

  onRequestsAccepted: (callback: any) => {
    const channel: string = 'acceptRequest_success';
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);

    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);

    };
  },

  // *************************************************************************

  // onMessageReceived

  onMessageReceived: (callback: any) => {
    const channel: string = 'message_received';
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);

    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);

    };
  },

  onFileMessageSent: (callback: any) => {
    const channel: string = 'file_message_sent';
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
      callback(...args);

    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);

    };
  }




};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
