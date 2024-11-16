const initialState = {
  isConnected: false,
  name: null,
  address: null,
};

const polkaReducer = (state = initialState, action) => {
  switch (action.type) {
    // all user gets reducers
    case 'SET_POLKA_CONNECTED':
      state = {
        ...state,
        isConnected: action.payload
      }
    case 'SET_POLKA_WALLET':
      state = {
        ...state,
        name: action.payload.name,
        address: action.payload.address
      }
    default:
      return state;
  }
};

export default polkaReducer;