import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import UserContext from "../services/user";
import { useRealm } from "../services/realm";

export default function Restaurant({ id }) {
  const [currentUser] = useContext(UserContext);
  const [
    {
      restaurant: { id: restaurantId, name, cuisine, address, reviews },
    },
    api,
  ] = useRealm();

  useEffect(() => {
    api.getRestaurant(id).catch((e) => {
      console.log(e);
    });
  }, [id, api]);

  const removeReview = (reviewId, index) => {
    api.deleteReview(reviewId, currentUser.id).catch((e) => {
      console.log(e);
    });
  };

  if (!restaurantId) {
    return (
      <div>
        <br />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h5>{name}</h5>
      <p>
        <strong>Cuisine: </strong>
        {cuisine}
        <br />
        <strong>Address: </strong>
        {`${address.building} ${address.street}, ${address.zipcode}`}
      </p>
      <Link to={`/restaurants/${id}/review`} className="btn btn-primary">
        {" "}
        Add Review{" "}
      </Link>
      <h4> Reviews </h4>
      <div className="row">
        {reviews.length > 0 ? (
          reviews.map((review, index) => {
            const {
              id: reviewId,
              user_id,
              date,
              text,
              name: userName,
            } = review;
            return (
              <div className="col-lg-4 pb-1" key={index}>
                <div className="card">
                  <div className="card-body">
                    <p className="card-text">
                      {text}
                      <br />
                      <strong>User: </strong>
                      {userName}
                      <br />
                      <strong>Date: </strong>
                      {date}
                    </p>
                    {currentUser?.id === user_id && (
                      <div className="row">
                        <a
                          onClick={() => removeReview(reviewId, index)}
                          className="btn btn-primary col-lg-5 mx-1 mb-1"
                        >
                          Remove
                        </a>
                        <Link
                          to={{
                            pathname: `/restaurants/${id}/review`,
                            state: {
                              currentReview: review,
                            },
                          }}
                          className="btn btn-primary col-lg-5 mx-1 mb-1"
                        >
                          Edit
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-sm-4">
            <p>Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  );
}
