import { FETCH_FAILURE } from "zoapp-front/actions/constants";
import { signOut } from "zoapp-front/actions/auth";

const middleware = (store) => (next) => (action) => {
  const result = next(action);

  const regex = new RegExp(`^.*${FETCH_FAILURE}$`);
  if (regex.test(action.type)) {
    console.log(action);
    store.dispatch(signOut({ provider: store.getState().auth.provider }));
  }

  return result;
};

export default middleware;
