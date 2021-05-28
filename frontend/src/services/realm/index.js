import React, { useContext, useEffect, useReducer, useState } from "react";

import UserContext from "../user";
import RealmAPI from "./api";
import realmReducer from "./reducer";

const RealmContext = React.createContext([{}, () => {}]); // default value used when there is *no* provider in component tree

export function RealmContextProvider(props) {
  const [state, dispatch] = useReducer(realmReducer, {});
  const [api] = useState(() => new RealmAPI(dispatch));

  const [currentUser] = useContext(UserContext); // grab user-state changes
  useEffect(() => {
    console.info("Realm context changing");
    api.auth(currentUser);
  }, [api, currentUser]);

  return <RealmContext.Provider value={[state, api]} {...props} />;
}

export function useRealm() {
  return useContext(RealmContext);
}

export default RealmContext;
