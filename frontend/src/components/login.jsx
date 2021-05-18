import React, { useState, useContext } from "react";

import UserContext from "../services/user";

export default function Login({ history }) {

  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [user, setUser] = useState(currentUser || {});
  const { name: userName, id: userId } = user;
  
  const updateUser = ({ target: { name, value }}) => {
    setUser({ ...user, [name]: value });
  };
  
  const doLogin = () => {
    setCurrentUser(user)
    history.push('/');  // from Route props
  }
  
  return (
    <div className="submit-form">
      <div>
        <div className="form-group">
          <label htmlFor="user">Username</label>
          <input
            type="text"
            className="form-control"
            id="name"
            required
            value={userName}
            onChange={updateUser}
            name="name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="id">ID</label>
          <input
            type="text"
            className="form-control"
            id="id"
            required
            value={userId}
            onChange={updateUser}
            name="id"
          />
        </div>

        <button onClick={doLogin} className="btn btn-success">
          Login
        </button>
      </div>
    </div>
  );
};
