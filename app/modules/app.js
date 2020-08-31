import {createAction, handleActions} from 'redux-actions';
const utils = require('../utils');

// action types
const SET_STATUS_HIDDEN = 'app/SET_STATUS_HIDDEN';


// action creator
export const setStatusHidden = createAction(SET_STATUS_HIDDEN);

const initialState = {
    statusHidden: true,
}

// reducer 
export default handleActions({
    [SET_STATUS_HIDDEN]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const statusHidden = action.payload;
        return {
            ...state,
            statusHidden
        }
    },
}, initialState);