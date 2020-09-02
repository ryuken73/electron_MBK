import {createAction, handleActions} from 'redux-actions';
const utils = require('../utils');

// action types
const ADD_CARD_ITEM = 'itemList/ADD_CARD_ITEM';
const DEL_CARD_ITEM = 'itemList/DEL_CARD_ITEM';
const UPDATE_CARD_ITEM = 'itemList/UPDATE_CARD_ITEM';

// action creator
export const addCardItem = createAction(ADD_CARD_ITEM);
export const delCardItem = createAction(DEL_CARD_ITEM);
export const updateCardItem = createAction(UPDATE_CARD_ITEM);

const initialState = {
    cardItems: new Map()
}

// reducer 
export default handleActions({
    [ADD_CARD_ITEM]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {cardId, cardInfo} = action.payload;
        const cardItems = new Map(state.cardItems);
        cardItems.set(cardId, cardInfo);
        return {
            ...state,
            cardItems
        }
    },
    [UPDATE_CARD_ITEM]: (state, action) => {
        console.log('%%%%%%%%%%%%%%%%', action.payload);
        const {cardId, property, value} = action.payload;
        const cardItems = new Map(state.cardItems);
        const updateItem = {...cardItems.get(cardId)};
        updateItem[property] = value;
        cardItems.set(cardId, updateItem);
        return {
            ...state,
            cardItems
        }
    },

}, initialState);