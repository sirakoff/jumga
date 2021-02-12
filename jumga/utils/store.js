import { useMemo } from 'react'
import { createStore, applyMiddleware } from 'redux'
// import { composeWithDevTools } from 'redux-devtools-extension'

let store

const initialState = {
  lastUpdate: 0,
  light: false,
  count: 0,
}

const reducer = (state = initialState, action) => {

    if (action.productId && !(action.productId in state)) {

        state[action.productId] = 0;

    }

    switch (action.type) {
        case 'INCREMENT':

            return {
                ...state,
                [action.productId]: state[action.productId] + 1,
            }
        case 'DECREMENT':

			const _state = {
                ...state,
                [action.productId]: state[action.productId] === 0 ? 0 : state[action.productId] - 1,
			};
			
			if (_state[action.productId] === 0) {

				delete _state[action.productId];

			}

            return _state;
        case 'RESET':
            return {
                
            }
        default:
            return state
    }
}

const fetchPersisted = () => {

	try{

		const cart = localStorage.getItem('cart');

		return cart ? JSON.parse(cart) : {};

	} catch(e) {

		console.log(e);

	}

}

function initStore(preloadedState = initialState) {
  return createStore(
    reducer,
    typeof window !== 'undefined' ? fetchPersisted() :preloadedState,
    // composeWithDevTools(applyMiddleware())
  )
}

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // Create the store once in the client
  if (!store) {

	store = _store

	if (!(typeof window === 'undefined')) {
		_store.subscribe(() => {

			try{


				localStorage.setItem('cart', JSON.stringify(_store.getState()))


			} catch(e) {

				console.log(e);

			}

		})

	}
  }



  return _store
}

export function useStore(initialState) {
  const store = useMemo(() => initializeStore(initialState), [initialState])
  return store
}