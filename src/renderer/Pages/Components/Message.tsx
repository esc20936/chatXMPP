import React from 'react';

interface chatMessage {
  fromLocal: boolean;
  message: string;
  timeStamp: number;
  from: string;
}

export default function Message({
  fromLocal,
  message,
  timeStamp,
}: chatMessage) {

 let leftOrRight = fromLocal ? 'rounded-br-none' : 'rounded-bl-none'
 let opposite = fromLocal ? 'end' : 'start';
 let color = fromLocal ? 'bg-accentColor/20' : 'bg-focusMainColor';

//   every 100 characters, add a new line
    

//  convert timestamp to local time
    let date = new Date(timeStamp);
    let hours = date.getHours();
    let minutes = date.getMinutes();

    let time = `${hours}:${minutes}`;
    

  return <div className={`w-full h-16 flex flex-row  items-start justify-${opposite} text-left
  ` }>
    <div className={`flex flex-col items-${opposite} justify-start h-auto w-auto 
        ${color} rounded-lg ${leftOrRight} px-6 py-2 m-2
    `}>
        <h1 className='text-sm font-normal text-white'>{message}</h1>
        <p className='mt-2 text-xs text-white/50 '>{time}</p>
    </div>
  </div>;
}
