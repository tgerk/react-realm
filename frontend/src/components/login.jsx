import React, { useState, useContext, useRef } from "react";

import { Dropdown } from "../presentation"
import UserContext from "../services/user";

export default function Login({ doLogin, focusRef }) {

  const [currentUser, _] = useContext(UserContext);
  const [user, setUser] = useState(currentUser || {});
  const { name: userName, id: userId } = user;

  const updateUser = ({ target: { name, value } }) => {
    setUser({ ...user, [name]: value });
  };

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
            ref={focusRef}
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

        <button onClick={() => doLogin(user)} className="btn btn-success">
          Login
        </button>
      </div>
    </div>
  );
};


export function LoginMenuItem() {
  const [currentUser, setUser] = useContext(UserContext)
  const focusRef = useRef();

  if (currentUser) {
    return (
      <a onClick={() => setUser(null)} className="nav-link" style={{ cursor: 'pointer' }}>
        Logout {currentUser.name}
      </a>
    )
  }

  return (
    <Dropdown affordanceType="button" affordanceText="Login" focusRef={focusRef} style={{ postion: "relative" }}>
      <Login doLogin={setUser} style={{ postion: "absolute" }} focusRef={focusRef} />
    </Dropdown>
  )
}
