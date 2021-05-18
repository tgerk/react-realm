import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { get as getRestaurant, deleteReview } from "../services/restaurant";

// TODO: useContext for user
export default function Restaurant({ id, currentUser }) {

  const [{ _id: restaurantId, name, cuisine, address, reviews }, setRestaurant] = useState({});

  const retrieveRestaurant = id => {
    getRestaurant(id)
      .then(response => {
        console.log(response.data);
        setRestaurant(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    retrieveRestaurant(id);
  }, [id]);

  const removeReview = (reviewId, index) => {
    deleteReview(reviewId, currentUser.id)
      .then(() => {
        setRestaurant((restaurant) => {
          // splice is not a great fit with immutability
          const reviews = [...restaurant.reviews]
          reviews.splice(index, 1)
          return ({
            ...restaurant, reviews 
          })
        })
      })
      .catch(e => {
        console.log(e);
      });
  };

  return (
    <div>
      {restaurantId ? (
        <div>
          <h5>{name}</h5>
          <p>
            <strong>Cuisine: </strong>{cuisine}<br />
            <strong>Address: </strong>{`${address.building} ${address.street}, ${address.zipcode}`}
          </p>
          <Link to={`/restaurants/${id}/review`} className="btn btn-primary">
            Add Review
          </Link>
          <h4> Reviews </h4>
          <div className="row">
            {reviews.length > 0 ? (
              reviews.map((review, index) => {
                const { _id: reviewId, user_id, date, text, name: userName } = review
                return (
                  <div className="col-lg-4 pb-1" key={index}>
                    <div className="card">
                      <div className="card-body">
                        <p className="card-text">
                          {text}<br />
                          <strong>User: </strong>{userName}<br />
                          <strong>Date: </strong>{date}
                        </p>
                        {currentUser?.id === user_id &&
                          <div className="row">
                            <a onClick={() => removeReview(reviewId, index)} className="btn btn-primary col-lg-5 mx-1 mb-1">Remove</a>
                            <Link to={{
                              pathname: `/restaurants/${id}/review`,
                              state: {
                                currentReview: review
                              }
                            }} className="btn btn-primary col-lg-5 mx-1 mb-1">Edit</Link>
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-sm-4">
                <p>Add the first review!</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <br />
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};
