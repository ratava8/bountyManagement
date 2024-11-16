import { combineReducers } from "redux";
import usersReducer from "./usersReducer";
import polkaReducer from "./polkaReducer";

const rootReducer = combineReducers({
  users: usersReducer,
  polka: polkaReducer,
});

export default rootReducer;
