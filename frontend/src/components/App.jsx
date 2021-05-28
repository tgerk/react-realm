import React from "react";
import { Switch, Route, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import RestaurantList from "./restaurant-list";
import Restaurant from "./restaurant";
import Review from "./review";
import { LoginMenuItem } from "./login";

import { UserContextProvider } from "../services/user";
import { RealmContextProvider } from "../services/realm";

export default function App() {
  return (
    <UserContextProvider>
      <RealmContextProvider>
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
            <li className="nav-item">
              <LoginMenuItem />
            </li>
          </div>
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route
              path="/restaurants/:id/review"
              render={(props) => {
                return (
                  <Review
                    {...props}
                    restaurantId={props.match.params.id}
                    currentReview={props.location.state?.currentReview || {}}
                  />
                );
              }}
            />

            <Route
              path="/restaurants/:id"
              render={(props) => {
                return <Restaurant {...props} id={props.match.params.id} />;
              }}
            />

            <Route path={["/", "/restaurants"]} component={RestaurantList} />
          </Switch>
        </div>
      </RealmContextProvider>
    </UserContextProvider>
  );
}
