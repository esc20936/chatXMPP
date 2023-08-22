import { createSlice } from "@reduxjs/toolkit";

export const RequestsSlice = createSlice({
    name: 'Requests',
    initialState: {
       value: [],
    },
    reducers: {
        addRequest: (state, action) => {
            console.log('addRequest',action);
            let username = action.payload;
            console.log('addRequest',username);
            state.value.push(username);
        },
        removeRequestByUsername: (state,action) => {
            let username = action.payload;
            let index = state.value.indexOf(username);
            if (index > -1) {
                state.value.splice(index, 1);
            }
            
        },
        clearRequests: (state) => {
            state.value = [];
        }
    }
});

export const { addRequest, removeRequestByUsername,clearRequests } = RequestsSlice.actions;