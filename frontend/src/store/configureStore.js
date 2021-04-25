import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import localForage from 'localforage';
import { v4 } from "uuid";

import reducer from './reducer'

const storage = localForage.createInstance({
    name: v4()
})

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, reducer) // persisting redux store through reload 

export default () => {
    let store = createStore(
        persistedReducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // za koriscenje Redux Devtools ekstenzije)
    );
    let persistor = persistStore(store);
    return { store, persistor };
}
