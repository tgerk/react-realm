import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getAll as getRestaurants, getCuisines, find as searchRestaurants } from "../services/restaurant";

export default function RestaurantList() {

  // TODO: useContext to cache pages and searches
  const [restaurants, setRestaurants] = useState([]);
  const [cuisines, setCuisines] = useState(["All Cuisines"]);
  const [searchName, setSearchName ] = useState("");
  const [searchZip, setSearchZip ] = useState("");
  const [searchCuisine, setSearchCuisine ] = useState("");

  // TODO: use state parameters to always parameterize search-retrieval
  const retrieveRestaurants = () => {
    getRestaurants()
      .then(response => {
        console.log(response.data);
        setRestaurants(response.data.restaurants);
        
      })
      .catch(e => {
        console.log(e);
      });
  };

  const retrieveCuisines = () => {
    getCuisines()
      .then(response => {
        console.log(response.data);
        setCuisines(["All Cuisines"].concat(response.data));
      })
      .catch(e => {
        console.log(e);
      });
  };

  //TODO: update the page (after a brief delay) on change of name, zip, cuisine & remove the "search" buttons
  useEffect(() => {
    retrieveRestaurants();
    retrieveCuisines();
  }, []);

  const find = (query, by) => {
    searchRestaurants(query, by)
      .then(response => {
        console.log(response.data);
        setRestaurants(response.data.restaurants);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const findByName = () => {
    setSearchZip("");
    setSearchCuisine("All Cuisines");
    find(searchName, "name");
  };
  
  const findByZip = () => {
    setSearchName("");
    setSearchCuisine("All Cuisines");
    find(searchZip, "zipcode")
  };
  
  const findByCuisine = () => {
    setSearchName("");
    setSearchZip("");
    if (searchCuisine === "All Cuisines") {
      retrieveRestaurants();
    } else {
      find(searchCuisine, "cuisine")
    }
  };

  return (
    <div>
      <div className="row pb-1">
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchName}
            onChange={({ target: { value }}) => { setSearchName(value) }}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByName}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by zip"
            value={searchZip}
            onChange={({ target: { value }}) => { setSearchZip(value) }}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByZip}
            >
              Search
            </button>
          </div>
        </div>
        <div className="input-group col-lg-4">

          <select onChange={({ target: { value }}) => { setSearchCuisine(value) }}>
             {cuisines.map(cuisine => {
               return (
                 <option value={cuisine}> {cuisine.substr(0, 20)} </option>
               )
             })}
          </select>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={findByCuisine}
            >
              Search
            </button>
          </div>

        </div>
      </div>
      <div className="row">
        {restaurants.map(({ _id: id, name, cuisine, address}, index) => {
          address = `${address.building} ${address.street}, ${address.zipcode}`;
          return (
            <div className="col-lg-4 pb-1" key={index}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{name}</h5>
                  <p className="card-text">
                    <strong>Cuisine: </strong>{cuisine}<br/>
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
