import React from 'react';

interface Props {
  username: string;
}

export default function RequestCard({ username }: Props) {
  let displayUsername = username.split('@')[0];

  let handleRejectRequest = () => {};

  let handleAcceptRequest = () => {
    window.electron.ipcRenderer.sendMessage('acceptRequest', {
      username: username,
    });
  };

  return (
    <div className="flex flex-col w-full h-32 transition duration-300 ease-in-out rounded-lg bg-focusMainColor ">
      {/* avatar */}
      <div className="flex flex-col items-center justify-center w-full h-full p-2 ">
        <h1 className="font-bold text-white text-sm-">{displayUsername}</h1>
      </div>
      {/* info */}
      <div className="flex flex-col items-center justify-center w-full h-full p-2">
        {/* accept button */}
        <div className="flex flex-row items-center justify-center w-full h-auto">
          <button
            onClick={handleAcceptRequest}
          className="w-auto h-10 px-4 text-sm text-white transition duration-300 ease-in-out rounded-lg focus:ring-0 focus:outline-none hover:bg-hoverAccentColor ">
            Accept
          </button>

          {/* deny button */}
          <button className="w-auto h-10 px-4 text-sm text-white transition duration-300 ease-in-out rounded-lg focus:ring-0 focus:outline-none hover:bg-hoverAccentColor ">
            Deny
          </button>
        </div>
      </div>
    </div>
  );
}
