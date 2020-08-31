import {createAction, handleActions} from 'redux-actions';
const utils = require('../utils');

// action types
const SET_TODAY_TAB_ID = 'app/SET_TODAY_TAB_ID';
const SET_STATUS_HIDDEN = 'app/SET_STATUS_HIDDEN';


// action creator
export const setTodayTabId = createAction(SET_TODAY_TAB_ID);
export const setStatusHidden = createAction(SET_STATUS_HIDDEN);

const initialState = {
    todayTabId: null,
    statusHidden: true
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
    [SET_TODAY_TAB_ID]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const todayTabId = action.payload;
        return {
            ...state,
            todayTabId
        }
    },
}, initialState);