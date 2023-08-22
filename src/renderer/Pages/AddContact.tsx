import React, { useRef, useEffect, useState } from 'react';
import discordImage from '../../../assets/discord.svg';
import { useNavigate } from 'react-router-dom';


export default function AddContact() {
  const navigate = useNavigate();

  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [addContactErrorMessage, setAddContactErrorMessage] = useState<string>('');

  const JIDref = useRef<HTMLInputElement>(null);

  const handleAddUser = () => {
    let JID = JIDref.current?.value;

    if(JID === undefined || JID === null || JID === '') {
        setAddContactErrorMessage('Error: JID is empty');
        return;
    }

    let username = JID+ "@alumchat.xyz";
    setLoginLoading(true);

    window.electron.ipcRenderer.sendMessage('addContact', {
        username: username,
    });
  };

  const handleGoBack = () => {
    navigate('/main');
  };

  useEffect(() => {
    console.log('add contact page');

    // add contact success listener
    const removeAddContactSuccessListener = window.electron.onAddContactSuccess((username:string) => {
        setLoginLoading(false);
        console.log('add contact success');
        console.log(username);
        navigate('/main');
    });

    // add contact error listener
    const removeAddContactErrorListener = window.electron.onAddContactFailure((message: string) => {
        setLoginLoading(false);
        console.log('add contact error');
        setAddContactErrorMessage('Error: ' + message);
    });
    



   

    return () => {
        removeAddContactSuccessListener();
        removeAddContactErrorListener();
    };
  }, []);

  return (
    <main className="flex flex-col items-center justify-center w-full h-full p-12 bg-white/10">
      <div className="flex flex-row w-8/12 rounded-lg shadow-xl h-4/5 bg-mainColor drop-shadow-lg">

        <div className="flex flex-col items-center justify-center w-full p-4 rounded-lg shadow-lg">
          <h1 className="mb-8 text-4xl font-bold text-center colorText">add contact</h1>
          <input
            ref={JIDref}
            className="w-full h-12 px-4 text-white rounded-lg bg-focusMainColor focus:ring-0 focus:outline-none"
            placeholder="JID"
          />

          <div className="flex flex-row items-center justify-center w-full mt-4">

          <button
            className="w-1/6 h-12 px-4 mt-8 text-white transition duration-100 ease-in-out rounded-lg bg-accentColor focus:ring-0 focus:outline-none hover:bg-hoverAccentColor "
            onClick={handleAddUser}
            disabled={loginLoading}
          >
            {loginLoading ? (
              <p className="text-white/50">Loading...</p>
            ) : (
              <p>Add</p>
            )}
          </button>

          {/* cancel button */}
            <button
                className="w-1/6 h-12 px-4 mt-8 ml-4 text-white transition duration-100 ease-in-out rounded-lg bg-red-500/60 focus:ring-0 focus:outline-none hover:bg-red-500 "
                onClick={handleGoBack}
            >
                cancel
            </button>
                
        </div>
         
          <p className="mt-4 text-center text-white">{addContactErrorMessage}</p>


        </div>
      </div>
    </main>
  );
}
