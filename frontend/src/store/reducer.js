import * as actionTypes from './actions';
import { REHYDRATE, PERSIST } from 'redux-persist'

const initialState = {
    user: {
        id: 0,
        firstName: "",
        lastName: "",
        email: "",
        role: ""
    },
    jwt: ""
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SAVE_USER: {
            return {
                ...state,
                user: {
                    ...action.user
                }
            }
        };
        case actionTypes.REMOVE_USER: {
            return {
                ...state,
                user: initialState.user,
            }
        };
        case actionTypes.SAVE_JWT: {
            return {
                ...state,
                jwt: action.jwt,
            }
        };
        case actionTypes.REMOVE_JWT: {
            return {
                ...state,
                jwt: initialState.jwt,
            }
        };
        default:
            return state;
    }
}

export default reducer;