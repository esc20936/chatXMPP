import { createSlice } from "@reduxjs/toolkit";

export const ContactsSlice = createSlice({
    name: 'contacts',
    initialState: {
       value: [],
    },
    reducers: {
        addContact: (state, action) => {
            console.log('addRequest',action);
            let username = action.payload;
            console.log('addRequest',username);
            state.value.push(username);
        },
        removeContactByUsername: (state,action) => {
            let username = action.payload;
            let index = state.value.indexOf(username);
            if (index > -1) {
                state.value.splice(index, 1);
            }
            
        },
        clearContacts: (state) => {
            state.value = [];
        },
        setContacts: (state,action) =>{
            let array = action.payload;
            state.value = array;
        }

    }
});

export const { addContact, removeContactByUsername,clearContacts,setContacts } = ContactsSlice.actions;