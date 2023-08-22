import React from 'react'
import ContactCard from './ContactCard'
import RequestCard from './RequestCard'
import { useNavigate } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux';
import { clearActiveChat } from 'renderer/Store/ActiveChat/AcitveChatSlice';
import { clearContacts } from 'renderer/Store/contacts/ContactsSlice';
import { clearRequests } from 'renderer/Store/requests/RequestsSlice';

export default function Extra() {
    const navigate = useNavigate()
    const requests = useSelector((state:any) => state.requests.value);
    const dispatch = useDispatch();


    const hadleLogout = () => {
        window.electron.ipcRenderer.sendMessage('logout', {});
        dispatch(clearActiveChat());
        dispatch(clearContacts());
        dispatch(clearRequests());


        navigate('/')
    }

    const removeAccount = () => {
        window.electron.ipcRenderer.sendMessage('removeAccount', {});
        dispatch(clearActiveChat());
        dispatch(clearContacts());
        dispatch(clearRequests());

        navigate('/')
    }   


  return (
    <div className='flex flex-col items-start justify-start w-full h-full p-2'>
        {/* search input */}
        <div className='flex flex-col items-start justify-center w-full h-screen-2/16'>
            <h1 className='text-lg font-bold text-white'>Requests</h1>
        </div>

        {/* contacts */}
        <div className='flex flex-col items-center justify-start w-full gap-2 px-2 overflow-y-scroll h-screen-10/16'>
            {
                requests.map((e:string, i:any) => {
                    return <RequestCard key={i} username={e} />
                }
                )
            }
        </div>

        <div className='flex flex-col items-center justify-center w-full gap-2 h-screen-4/16'>
            {/* log out button */}
            <button className='w-11/12 h-10 px-4 text-white transition duration-300 ease-in-out rounded-lg bg-red-600/20 focus:ring-0 focus:outline-none '
            onClick={hadleLogout}
            >Log out</button>

            {/* remove account button */}
            <button className='w-11/12 h-10 px-4 text-white transition duration-300 ease-in-out rounded-lg bg-red-600/20 focus:ring-0 focus:outline-none '
            onClick={removeAccount}
            >Remove account</button>
            

            </div>


    </div>
  )
}
