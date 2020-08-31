import {createAction, handleActions} from 'redux-actions';
const utils = require('../utils');

// action types
const SET_SAVE_DIRECTORY = 'controlPanel/SET_SAVE_DIRECTORY';
const SELECT_ALL_ITEMS = 'controlPanel/SELECT_ALL_ITEMS';
const DELETE_SELECTED_ITEMS = 'controlPanel/DELETE_SELECTED_ITEMS';

// action creator
export const setSaveDirectory = createAction(SET_SAVE_DIRECTORY);
export const selectAllItems = createAction(SELECT_ALL_ITEMS);
export const deleteSelectedItems = createAction(DELETE_SELECTED_ITEMS);

const initialState = {
    saveDirectory : null
}

// reducer 
export default handleActions({
    [SET_SAVE_DIRECTORY]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const directory = action.payload;
        return {
            ...state,
            saveDirectory: directory
        }
    },
}, initialState);