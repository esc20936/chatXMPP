import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Message from './Message';
import { addMessage } from 'renderer/Store/ActiveChat/AcitveChatSlice';

interface chatMessage {
  fromLocal: boolean;
  message: string;
  timeStamp: number;
}

export default function Chat() {
  const activeChat = useSelector((state: any) => state.activeChat);
  const inputRef = useRef<HTMLInputElement>(null);



  const dispatch = useDispatch();

  const handleSendMessage = () => {
    let message = inputRef.current?.value;

    if (message === '') return;

    inputRef.current!.value = '';

    const newMessage = {
      fromLocal: true,
      message: message,
      timeStamp: Date.now(),
      from: activeChat.JID,
    };

    window.electron.ipcRenderer.sendMessage('sendMessage', {
      message: message,
      to: activeChat.JID,
      timeStamp: Date.now(),
      fromLocal: true,
      from: activeChat.JID,
    });

    dispatch(addMessage(newMessage));
    inputRef.current!.focus();
  };

  const handleSendFile = () => {
    window.electron.ipcRenderer.sendMessage('sendFile', {
      JID: activeChat.JID,
    });
  }



  return (
    <main className="flex flex-col justify-start w-full h-full center">
      {/* header */}
      <div className="flex flex-row items-center justify-start w-full h-screen-2/16">
        {/* chat info */}
        <div className="flex flex-col items-start justify-start w-3/4 h-full p-6">
          <h1 className="text-lg font-bold text-white">
            {activeChat.title ? activeChat.title : 'No chat selected'}
          </h1>
          <p className="text-xs text-white/50">
            {activeChat.JID ? activeChat.JID : 'No chat selected'}
          </p>
        </div>


      </div>

      {/* chat */}
      <div className="flex flex-col items-start justify-start w-full gap-3 overflow-y-scroll h-screen-12/16">
        {activeChat.messages.map((e: any, i: any) => {
          console.log(e);
          if (e.from.includes(activeChat.JID)) {
            return (
              <Message
                key={i}
                fromLocal={e.fromLocal}
                message={e.message || e.body}
                timeStamp={e.timeStamp}
                from=""
              />
            );
          }
        })}
      </div>

      {/* input */}
      <div className="flex flex-row items-center justify-center w-full px-8 h-screen-2/16 bg-mainColor/90">
        <input
          ref={inputRef}
          className="w-8/12 h-10 px-4 ml-4 text-white rounded-lg bg-focusMainColor focus:ring-0 focus:outline-none"
          placeholder="Message"
        />
        <button
          className="w-3/12 h-10 px-4 ml-4 text-white transition duration-300 ease-in-out rounded-lg bg-accentColor/40 focus:ring-0 focus:outline-none hover:bg-hoverAccentColor "
          onClick={handleSendMessage}
        >
          Send
        </button>
        <button
          className="w-3/12 h-10 px-4 ml-4 text-white transition duration-300 ease-in-out rounded-lg bg-accentColor/40 focus:ring-0 focus:outline-none hover:bg-hoverAccentColor "
          onClick={handleSendFile}
        >
          File
        </button>
      </div>
    </main>
  );
}
