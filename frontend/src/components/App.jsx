import React from "react";
import { Switch, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import RestaurantList from "./restaurant-list";
import Restaurant from "./restaurant";
import Review from "./review";
import Login from "./login";

import UserContext from "../services/user"

export default function App() {

  // components access current user through context
  const userState = React.useState(null),
    [user, setUser] = userState

  return (
    <UserContext.Provider value={userState}>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <a href="/restaurants" className="navbar-brand">
          Restaurant Reviews
        </a>
        <div className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to={"/restaurants"} className="nav-link">
              Restaurants
            </Link>
          </li>
          <li className="nav-item" >
            {user ? (
              <a onClick={() => setUser(null)} className="nav-link" style={{ cursor: 'pointer' }}>
                Logout {user.name}
              </a>
            ) : (
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            )}

          </li>
        </div>
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/restaurants"]} component={RestaurantList} />

          <Route path="/login" component={Login} />

          <Route
            path="/restaurants/:id/review"
            render={(props) => {
              return (
                <Review {...props} id={props.match.params.id} currentReview={props.location.state?.currentReview || {}} />
              )
            }}
          />

          <Route
            path="/restaurants/:id"
            render={(props) => {
              return (
                <Restaurant {...props} id={props.match.params.id} />
              )
            }}
          />
        </Switch>
      </div>
    </UserContext.Provider>
  );
}
