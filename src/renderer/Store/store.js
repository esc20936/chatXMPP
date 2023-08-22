import { configureStore } from '@reduxjs/toolkit';

import { RequestsSlice } from './requests/RequestsSlice';
import { ContactsSlice } from './contacts/ContactsSlice';
import { ActiveChatSlice } from './ActiveChat/AcitveChatSlice';
export const store = configureStore({
    reducer: {
        requests: RequestsSlice.reducer,
        contacts: ContactsSlice.reducer,
        activeChat: ActiveChatSlice.reducer
    }
});

