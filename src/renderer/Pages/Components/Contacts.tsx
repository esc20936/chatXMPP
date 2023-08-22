import React from 'react'
import ContactCard from './ContactCard'
import { useNavigate } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux';

interface Contact {
    jid : string,
    name : string,
    subscription : string,
}

export default function Contacts() {
    const navigate = useNavigate()

    const contacts = useSelector((state: any) => state.contacts.value)

    console.log(contacts);
    
    const handleAddContact = () => {
        navigate('/add-contact')
    }
  return (
    <div className='flex flex-col items-start justify-start w-full h-full p-2'>
        {/* search input */}
        <div className='flex flex-col items-center justify-center w-full h-screen-2/16'>
            <input className='w-11/12 h-10 px-4 text-white rounded-lg bg-focusMainColor focus:ring-0 focus:outline-none' placeholder='Search' />
        </div>

        {/* contacts */}
        <div className='flex flex-col items-center justify-start w-full px-2 overflow-y-scroll h-screen-12/16'>
            {
                contacts.map(({jid, name, subscription} : Contact, i) => {
                    return <ContactCard key={i} jid={jid} name={name} subscription={subscription}/>
                }
                )
            }
        </div>

        <div className='flex flex-col items-center justify-center w-full h-screen-2/16'>
            <button className='w-11/12 h-10 px-4 text-white transition duration-300 ease-in-out rounded-lg focus:ring-0 focus:outline-none hover:bg-hoverAccentColor '
            onClick={handleAddContact}
            >Add contact</button>    
        </div>

    </div>
  )
}
