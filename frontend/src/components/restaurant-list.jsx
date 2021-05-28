import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce";

import Dropdown from "./presentation/dropdown";
import CardGallery from "./presentation/card-gallery";
import { useRealm } from "../services/realm";

const ALL_CUISINES = "All Cuisines";

//TODO: pagination & caching
export default function RestaurantList() {
  const [{ restaurants = [], cuisines = [] }, api] = useRealm();
  const [query, setQuery] = useState({});
  const focusRef = useRef();

  // debouncing provides automatic and periodic updates according to changing search parameters
  const [debouncedQuery] = useDebounce(query, 800);

  useEffect(() => {
    const req = api.getCuisines();
    req.catch((e) => {
      console.log(e);
    });

    return req.cancel;
  }, [api]);

  useEffect(() => {
    const req = (() =>
      Object.entries(debouncedQuery).length
        ? api.searchRestaurants(debouncedQuery)
        : api.getRestaurants())();
    req.catch((e) => {
      console.log(e);
    });

    return req.cancel;
  }, [debouncedQuery, api]);

  const updateQuery = (key, value) => {
    if (value === "" || (key === "cuisine" && value === ALL_CUISINES)) {
      // erase key from the query
      const newQuery = { ...query };
      delete newQuery[key];
      setQuery(newQuery);
    } else {
      setQuery({ ...query, [key]: value });
    }
  };

  return (
    <div className="restaurants-list">
      <Dropdown
        affordanceType="button"
        affordanceText="Search"
        focusRef={focusRef}
        className="restaurants-search"
      >
        <div className="row pb-1">
          <div className="input-group col-lg-4">
            <input
              type="text"
              className="form-control"
              placeholder="Text search (name or street)"
              value={query.name}
              onChange={({ target: { value } }) => {
                updateQuery("text", value);
              }}
              ref={focusRef}
            />
          </div>
          <div className="input-group col-lg-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by zip"
              value={query.zipcode}
              onChange={({ target: { value } }) => {
                updateQuery("zipcode", value);
              }}
            />
          </div>
          <div className="input-group col-lg-4">
            <select
              onChange={({ target: { value } }) => {
                updateQuery("cuisine", value);
              }}
            >
              <option value={ALL_CUISINES}> {ALL_CUISINES} </option>
              {cuisines.map((cuisine, key) => (
                <option value={cuisine} key={key}>
                  {" "}
                  {cuisine.substr(0, 20)}{" "}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Dropdown>

      {restaurants.length ? (
        <CardGallery items={restaurants.map(restaurantToCardMapping)} />
      ) : (
        <div>
          <br />
          <p>Loading...</p>
        </div>
      )}
    </div>
  );

  function restaurantToCardMapping({ id, name, cuisine, address }) {
    address = `${address.building} ${address.street}, ${address.zipcode}`;

    return {
      title: name,
      text: (
        <dl>
          <dt>Cuisine:</dt>
          <dd>{cuisine}</dd>
          <dt>Address:</dt>
          <dd>{address}</dd>
        </dl>
      ),
      buttons: [
        <Link to={`/restaurants/${id}`}> See Reviews </Link>,
        <a
          href={`https://www.google.com/maps/place/${address}`}
          target="_blank"
          rel="noreferrer"
        >
          {" "}
          View Map{" "}
        </a>,
      ],
    };
  }
}
