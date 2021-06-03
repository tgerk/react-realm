import React from "react";

import Search from "./Search";
import RestaurantCard from "./Card";
import Gallery from "../Gallery";

import { useRealm } from "../../services/realm";

//TODO: pagination & caching
export default function RestaurantList() {
  const [{ restaurants = [] }] = useRealm();

  return (
    <div className="restaurants-list">
      <Search />

      {restaurants.length ? (
        <Gallery component={RestaurantCard} items={restaurants} />
      ) : (
        <p className="loading">Loading...</p>
      )}
    </div>
  );
}
