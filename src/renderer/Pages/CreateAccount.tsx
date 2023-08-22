import React, {useRef, useState, useEffect} from 'react'
import discordImage from '../../../assets/discord.svg';
import { useNavigate } from 'react-router-dom';



export default function CreateAccount() {

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState<string>('');


  const handleRegister = () => {
    setLoginLoading(true);
    setLoginErrorMessage('');

    window.electron.ipcRenderer.sendMessage('register', {
      username: usernameRef.current?.value,
      password: passwordRef.current?.value,
    });
  }

  const handleLogin = () => {
    navigate('/');
  }


  useEffect(() => {

    // register success listener
    const removeRegisterSuccessListener = window.electron.onRegisterSuccess((username:string) => {
      setLoginLoading(false);
      console.log('register success');
      console.log(username);
      navigate('/');
    });

    // register error listener
    const removeRegisterErrorListener = window.electron.onRegisterFailure((message: string) => {
      setLoginLoading(false);
      console.log('register error');
      setLoginErrorMessage('Error: ' + message);
    });

    return () => {
      removeRegisterSuccessListener();
      removeRegisterErrorListener();
    };
  }, []);

  return (
      <main className="flex flex-col items-center justify-center w-full h-full p-12 bg-white/10">
        <div className="flex flex-row w-8/12 rounded-lg shadow-xl h-4/5 bg-mainColor drop-shadow-lg">
          {/* left side */}
          <div className="flex flex-col items-start justify-start w-1/2 h-full bg-yellow-300 rounded-l-lg">
            <div className="flex flex-col items-center justify-center w-full p-8 h-screen-8/16 ">
              <h1 className="text-6xl font-bold text-white colorText">XMPPro</h1>
              <p className="text-white/60">by Pablo Escobar</p>
            </div>
            <div className="flex flex-col items-end justify-end w-full mt-auto h-1/2">
              <img src={discordImage} alt="discord" className="mr-2" />
            </div>
          </div>
          {/* right side */}
          <div className="flex flex-col items-start justify-center w-1/2 p-4 rounded-lg shadow-lg">
            <h1 className="mb-8 text-4xl font-bold text-white">Create account</h1>
            <input
              ref={usernameRef}
              className="w-full h-12 px-4 text-white rounded-lg bg-focusMainColor focus:ring-0 focus:outline-none"
              placeholder="Username"
            />
            <input
              ref={passwordRef}
              className="w-full h-12 px-4 mt-4 text-white rounded-lg bg-focusMainColor focus:ring-0 focus:outline-none"
              placeholder="Password"
              type="password"
            />
            <button
              className="w-full h-12 px-4 mt-8 text-white transition duration-100 ease-in-out rounded-lg bg-accentColor focus:ring-0 focus:outline-none hover:bg-hoverAccentColor "
              onClick={handleRegister}
              disabled={loginLoading}
            >
              {loginLoading ? (
                <p className="text-white/50">Loading...</p>
              ) : (
                <p>Sign up</p>
              )}
            </button>
            <p className="mt-4 text-center text-white">{loginErrorMessage}</p>
  
            {/* create account */}
            <div className="flex flex-row items-center justify-center mt-8">
              <p className="text-white/50">Do you have an account?</p>
              <button className="ml-2 text-white transition duration-100 ease-in-out focus:ring-0 focus:outline-none hover:text-hoverAccentColor "
              onClick={handleLogin}>
                Login
              </button>
            </div>
          </div>
        </div>
      </main>
    );
}
