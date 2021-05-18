import React from "react"

const UserContext = React.createContext([null, () => {}])  // default value used when there is *no* provider in component tree
export default UserContext