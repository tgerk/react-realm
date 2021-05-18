import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import RestaurantList from "./restaurant-list";
import Restaurant from "./restaurant";
import Review from "./review";
import Login from "./login";

//TODO: use useReducer/useContext for user
export default function App() {

  const [user, setUser] = React.useState(null);

  return (
    <div>
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

          <Route
            path="/login"
            render={(props) => (
              <Login {...props} onLogin={setUser} currentUser={user} />
            )}
          />

          <Route
            path="/restaurants/:id/review"
            render={(props) => {
              const id = props.match?.params?.id;
              const currentReview = props.location?.state?.currentReview
              return (
                <Review {...props} id={id} currentReview={currentReview || {}} currentUser={user || {}} />
              )
            }}
          />

          <Route
            path="/restaurants/:id"
            render={(props) => {
              const id = props.match?.params?.id;
              return (
                <Restaurant {...props} id={id} currentUser={user || {}} />
              )
            }}
          />
        </Switch>
      </div>
    </div>
  );
}
