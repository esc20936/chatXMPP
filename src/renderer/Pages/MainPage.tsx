import React, { useEffect} from 'react'
import Chat from './Components/Chat'
import Contacts from './Components/Contacts'
import Extra from './Components/Extra'
import { useDispatch, useSelector } from 'react-redux';
import { addRequest,removeRequestByUsername } from 'renderer/Store/requests/RequestsSlice';
import { setContacts } from 'renderer/Store/contacts/ContactsSlice';
import { addMessage } from 'renderer/Store/ActiveChat/AcitveChatSlice';

export default function MainPage() {

    const dispatch = useDispatch();

    useEffect(() => {
      
      window.electron.ipcRenderer.sendMessage('getContacts', {});

      const removeGetContacts = window.electron.onGetContacts((contacts:any) => {
        console.log('get contacts');
        console.log(contacts);
        let resContacts = [];
        contacts.forEach((contact: any) => {
          const jid = contact.attrs.jid;
          const name = contact.attrs.name || jid.split('@')[0];
          const subscription = contact.attrs.subscription;
          resContacts.push({
            jid: jid,
            name: name,
            subscription: subscription,
          });
        })
        
        dispatch(setContacts(resContacts))

      });
      
      // request received listener
      const removeRequestReceivedListener = window.electron.onRequestsReceived((username:string) => {
        console.log('request received');
        dispatch(addRequest(username));
      }
      );

      // request accepted listener
      const removeRequestAcceptListener = window.electron.onRequestsAccepted((username:string) => {
        console.log('request accepted');
        dispatch(removeRequestByUsername(username));
      }
      );


      // message received listener
      const removeMessageReceivedListener = window.electron.onMessageReceived((message:any) => {
        console.log('message received');
        console.log(message);

        // TODO: add notifications for each user.
        let body = message.body;

        // split using 'says: \n'
        let split = body.split('says: \n');
        body = split[1];

        const newMessage = {
          fromLocal: false,
          message: body,
          timeStamp: Date.now(),
          from: message.from,
        };

        dispatch(addMessage(newMessage));

      }
      );


      // const removeOnFileMessageSent
      const removeOnFileMessageSent = window.electron.onFileMessageSent((message:any) => {
        console.log('file message sent');
        console.log(message);
        const newMessage = {
          fromLocal: true,
          message: message.body,
          timeStamp: Date.now(),
          from: message.to,
        };
        dispatch(addMessage(newMessage));
      }
      );


      return () => {
        removeRequestReceivedListener();
        removeRequestAcceptListener();
        removeGetContacts();
        removeMessageReceivedListener();
        removeOnFileMessageSent();
      }
      
    }, [])


  return (
    <main className='flex flex-row w-full h-full bg-mainColor/90'>
        {/* contacts */}
        <div className='flex flex-col items-start justify-start w-1/5 h-full '>
            <Contacts />
        </div>
        {/* chat */}
        <div className='flex flex-col items-start justify-start w-3/5 h-full rounded-lg bg-mainColor'>
            <Chat />
        </div>
        {/* user */}
        <div className='flex flex-col items-start justify-start w-1/5 h-full'>
            <Extra />
        </div>

    </main>
  )
}
