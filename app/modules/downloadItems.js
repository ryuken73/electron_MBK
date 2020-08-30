import {createAction, handleActions} from 'redux-actions';
const utils = require('../utils');

// action types
// const ADD_IMAGE_DATA = 'imageList/ADD_IMAGE_DATA';
const ADD_ITEM = 'downloadItems/ADD_ITEM';
const UPDATE_PROGRESS = 'downloadItems/UPDATE_PROGRESS';
const SET_STATUS_HIDDEN = 'downloadItems/SET_STATUS_HIDDEN';


// action creator
export const addItem = createAction(ADD_ITEM);
export const updateProgress = createAction(UPDATE_PROGRESS);
export const setStatusHidden = createAction(SET_STATUS_HIDDEN);

const initialState = {
    downloadItems: new Map(),
    statusHidden : false
}

// reducer
export default handleActions({
    [ADD_ITEM]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {itemInfo} = action.payload;
        const {id} = itemInfo;
        const downloadItems = new Map(state.downloadItems);
        downloadItems.set(id, itemInfo);
        return {
            ...state,
            downloadItems
        }
    },
    [UPDATE_PROGRESS]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {id, receivedBytes} = action.payload;
        const itemInfo = {...state.downloadItems.get(id)};
        itemInfo.receivedBytes = receivedBytes;
        const downloadItems = new Map(state.downloadItems);
        downloadItems.set(id, itemInfo);
        return {
            ...state,
            downloadItems
        }
    },
    [SET_STATUS_HIDDEN]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const statusHidden = action.payload;
        return {
            ...state,
            statusHidden
        }
    },
}, initialState);