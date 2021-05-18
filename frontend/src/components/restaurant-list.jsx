import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "use-debounce"

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
    if (key === "cuisine" && value === "All Cuisines" || !value) {
      // choosing "All Cuisines" erases the cuisine key from the query
      delete newQuery[key]
      setQuery(newQuery)
      return
    }

    setQuery({ ...query, [key]: value })
  }

  return (
    <div>
      <div className="row pb-1">
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={query.name}
            onChange={({ target: { value } }) => { updateQuery("name", value) }}
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
            {cuisines.map(cuisine => {
              return (
                <option value={cuisine}> {cuisine.substr(0, 20)} </option>
              )
            })}
          </select>
        </div>
      </div>

      <div className="row">
        {restaurants.map(({ _id: id, name, cuisine, address }, index) => {
          address = `${address.building} ${address.street}, ${address.zipcode}`;
          return (
            <div className="col-lg-4 pb-1" key={index}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{name}</h5>
                  <p className="card-text">
                    <strong>Cuisine: </strong>{cuisine}<br />
                    <strong>Address: </strong>{address}
                  </p>
                  <div className="row">
                    <Link to={`/restaurants/${id}`} className="btn btn-primary col-lg-5 mx-1 mb-1">
                      View Reviews
                    </Link>
                    <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/place/${address}`} className="btn btn-primary col-lg-5 mx-1 mb-1">View Map</a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}


      </div>
    </div>
  );
};
