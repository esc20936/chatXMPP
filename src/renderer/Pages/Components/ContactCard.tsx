import React from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { setAll,setTitle,setJID } from 'renderer/Store/ActiveChat/AcitveChatSlice';

interface Contact {
  jid : string,
  name : string,
  subscription : string,
}

export default function ContactCard({
  jid,
  name,
  subscription,
}: Contact) {

  let displayName = name[0]+name[1];

  let displayJid = jid.substring(0,10)+'...';


  const dispatch = useDispatch();

  

  const handleChat = () => {
    dispatch(setTitle(name));
    dispatch(setJID(jid));
    
  }



  return (
    <div
    onClick={handleChat}
    className='flex flex-row w-full h-16 transition duration-300 ease-in-out hover:bg-focusMainColor '>
        {/* avatar */}
        <div className='flex flex-col items-center justify-center w-1/6 h-full ml-2 '>
            <div className='flex flex-col items-center justify-center w-10 h-10 bg-purple-600 rounded-full'>
                <h1 className='font-bold text-center text-white text-md'>{displayName}</h1>
            </div>
        </div>
        {/* info */}
        <div className='flex flex-col items-start justify-center w-4/6 h-full p-2 ml-2'>
            <h1 className='font-bold text-white text-sm-'>{name}</h1>
            <p className='text-xs text-white/50'>{displayJid}</p>
        </div>

    </div>
  )
}
