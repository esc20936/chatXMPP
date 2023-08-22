import { createSlice } from "@reduxjs/toolkit";

// interface message {
//     sender: string,
//     content: string,
//     timestamp: number
// }

export const ActiveChatSlice = createSlice({
    name: 'activeChat',
    initialState: {
       title: '',
       messages:[],
       status:'online',
       JID:''

    },
    reducers: {
        setTitle: (state, action) => {
            state.title = action.payload;
        },
        addMessage: (state, action) => {
            let message = action.payload;
            state.messages.push(message);
        },
        clearActiveChat: (state) => {
            state.messages = [];
            state.title = '';
            state.status = 'online';
            state.JID = '';
        },
        setAll: (state,action) => {
            let title = action.payload.title;
            let messages = action.payload.messages;
            let status = action.payload.status;
            state.title = title;
            state.messages = messages;
            state.status = status;
        },
        setJID: (state,action) => {
            let JID = action.payload;
            state.JID = JID;
        }

    }
});

export const { addMessage, clearActiveChat, setTitle,setAll,setJID } = ActiveChatSlice.actions;