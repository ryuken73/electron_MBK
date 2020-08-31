import {createAction, handleActions} from 'redux-actions';
const utils = require('../utils');

// action types
// const ADD_IMAGE_DATA = 'imageList/ADD_IMAGE_DATA';
const ADD_PAGE = 'downloadItems/ADD_PAGE';
const ADD_ITEM = 'downloadItems/ADD_ITEM';
const SET_CURRENT_PAGE_ID = 'downloadItems/SET_CURRENT_PAGE_ID';
const UPDATE_PROGRESS = 'downloadItems/UPDATE_PROGRESS';
const SET_STATUS_HIDDEN = 'downloadItems/SET_STATUS_HIDDEN';


// action creator
export const addPage = createAction(ADD_PAGE);
export const addItem = createAction(ADD_ITEM);
export const setCurrentPageId = createAction(SET_CURRENT_PAGE_ID);
export const updateProgress = createAction(UPDATE_PROGRESS);
export const setStatusHidden = createAction(SET_STATUS_HIDDEN);

const initialState = {
    pages: new Map(),
    statusHidden: true,
    currentPageId : null
}

// page / downloadItems
// page = Map() {pageId, {downloadItems: Map of itemInfo}}
// downloadItems = Map() {itemid, itemInfo}

// reducer 
export default handleActions({
    [ADD_PAGE]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const pageId = action.payload;
        const pages = new Map(state.pages);
        const initialDownloadItems = {downloadItems: new Map()};
        pages.set(pageId, initialDownloadItems);
        return {
            ...state,
            pages
        }
    },
    [ADD_ITEM]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {pageId, itemInfo} = action.payload;
        const {id:itemId} = itemInfo;

        const downloadItems = new Map(state.get(pageId).downloadItems);
        downloadItems.set(itemId, itemInfo);
        
        const pages = new Map(state.pages.get(pageId));
        pages.downloadItems = downloadItems;

        return {
            ...state,
            pages
        }
    },
    [SET_CURRENT_PAGE_ID]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const pageId = action.payload;
        return {
            ...state,
            currentPageId: pageId
        }
    },
    [UPDATE_PROGRESS]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {pageId, id:itemId, receivedBytes} = action.payload;
        const itemInfo = {...state.pages.get(pageId).downloadItems.get(itemId)};
        itemInfo.receivedBytes = receivedBytes;

        const downloadItems = new Map(state.get(pageId).downloadItems);
        downloadItems.set(itemId, itemInfo);

        const pages = new Map(state.pages.get(pageId));
        PageTransitionEvent.downloadItems = downloadItems;

        return {
            ...state,
            pages
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