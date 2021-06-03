import React from "react";
import { Switch, Route, Link } from "react-router-dom";

import RestaurantList from "./restaurant/List";
import Restaurant from "./restaurant";
import Review from "./restaurant/review";
import UserLogin from "./Login";

import { UserContextProvider } from "../services/user";
import { RealmContextProvider } from "../services/realm";

export default function App() {
  return (
    <UserContextProvider>
      <nav>
        <a href="/"> Restaurant Reviews </a>
        <ul>
          <li>
            <Link to={"/restaurants"}> Restaurants </Link>
          </li>
          <li>
            <UserLogin />
          </li>
        </ul>
      </nav>

      <RealmContextProvider>
        <main>
          <Switch>
            <Route
              path="/restaurant/:id/review"
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
              path="/restaurant/:id"
              render={(props) => {
                return <Restaurant {...props} id={props.match.params.id} />;
              }}
            />

            <Route component={RestaurantList} />
          </Switch>
        </main>
      </RealmContextProvider>
    </UserContextProvider>
  );
}
