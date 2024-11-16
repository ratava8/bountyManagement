
export const setPolkaAccount = (payload) => async (dispatch) => {
  dispatch({ type: 'SET_POLKA_CONNECTED', payload: payload });
};
