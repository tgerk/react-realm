import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce"

import { Dropdown, CardGallery } from "../presentation"
import { getAll as getRestaurants, getCuisines, search as searchRestaurants } from "../services/restaurant";

//TODO: pagination & caching
export default function RestaurantList() {

  const [restaurants, setRestaurants] = useState([]);
  const [cuisines, setCuisines] = useState(["All Cuisines"]);
  const [query, setQuery] = useState({})

  useEffect(() => {
    return retrieveCuisines()
  }, []);

  // update on page load and (after a brief delay) on change of search parameters
  const [debouncedQuery] = useDebounce(query, 800);
  useEffect(() => {
    return retrieveRestaurants(debouncedQuery);
  }, [debouncedQuery]);

  const focusRef = useRef();

  const retrieveRestaurants = (query) => {
    const req = (() => Object.entries(query).length ? searchRestaurants(query) : getRestaurants())()
    req.then(response => {
      console.log(response.data);
      setRestaurants(response.data.restaurants);
    })
      .catch(e => {
        console.log(e);
      });

    return req.abort
  };

  const retrieveCuisines = () => {
    const req = getCuisines()
    req.then(response => {
      setCuisines(["All Cuisines"].concat(response.data));
    })
      .catch(e => {
        console.log(e);
      });

    return req.abort
  };

  const updateQuery = (key, value) => {
    const newQuery = { ...query }
    if (key === "cuisine" && (value === "All Cuisines" || !value)) {
      // choosing "All Cuisines" erases the cuisine key from the query
      delete newQuery[key]
      setQuery(newQuery)
      return
    }

    setQuery({ ...query, [key]: value })
  }

  return (
    <div>
      <Dropdown affordanceType="button" affordanceText="Search" focusRef={focusRef}>
        <div className="row pb-1">
          <div className="input-group col-lg-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name"
              value={query.name}
              onChange={({ target: { value } }) => { updateQuery("name", value) }}
              ref={focusRef}
            />
          </div>
          <div className="input-group col-lg-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by zip"
              value={query.zipcode}
              onChange={({ target: { value } }) => { updateQuery("zipcode", value) }}
            />
          </div>
          <div className="input-group col-lg-4">
            <select onChange={({ target: { value } }) => { updateQuery("cuisine", value) }}>
              {cuisines.map(cuisine => (
                <option value={cuisine}> {cuisine.substr(0, 20)} </option>
              ))}
            </select>
          </div>
        </div>
      </Dropdown>

      <CardGallery items={restaurants.map(restaurantToCardMapping)} />
    </div>
  );
};

function restaurantToCardMapping({ _id: id, name, cuisine, address }) {
  address = `${address.building} ${address.street}, ${address.zipcode}`;

  return ({
    title: name,
    text: (<ul style={{ listStyle: "none" }}>
      <li>
        <strong>Cuisine: </strong>{cuisine}
      </li>
      <li>
        <strong>Address: </strong>{address}
      </li>
    </ul>),
    buttons: [
      <Link to={`/restaurants/${id}`}> View Reviews </Link>,
      <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/place/${address}`}> View Map </a>
    ]
  })
}