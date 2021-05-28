import React, { useState } from "react";

const UserContext = React.createContext([null, () => {}]); // default value used when there is *no* provider in component tree

export function UserContextProvider(props) {
  const user = useState(null); // components access current user through context

  return <UserContext.Provider value={user} {...props} />;
}

export default UserContext;
