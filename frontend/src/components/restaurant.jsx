import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import CardGallery from "./presentation/card-gallery";

import UserContext from "../services/user";
import { useRealm } from "../services/realm";

export default function Restaurant({ id }) {
  const [currentUser] = useContext(UserContext);
  const [{ restaurant }, api] = useRealm();

  useEffect(() => {
    api.getRestaurant(id)
      .catch((e) => { console.log(e); });
  }, [id, api]);

  function removeReview(reviewId){
    api.deleteReview(reviewId, currentUser.id, id)
      .catch((e) => { console.log(e); });
  };

  if (!restaurant) {
    return (
      <div>
        <br />
        <p>Loading...</p>
      </div>
    );
  }

  const { name, description='[no description]', cuisine, address, reviews } = restaurant;
  return (
    <div>
      <h5>{name}</h5>
      <p>{description}</p>
        <dl>
          <dt>Cuisine:</dt>
          <dd>{cuisine}</dd>
          <dt>Address:</dt>
          <dd>{`${address.building} ${address.street}, ${address.zipcode}`}</dd>
        </dl>
      <Link to={`/restaurants/${id}/review`} className="btn btn-primary">
        {" "}
        Add Review{" "}
      </Link>
      <h4> Reviews </h4>
      <div className="row">
        {reviews.length > 0 ? (
          <CardGallery items={reviews.map(reviewToCardMapping)} />
        ) : (
          <div className="col-sm-4">
            <p>Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  );

  function reviewToCardMapping(review) {
    const { id: reviewId, userId, name: userName, date, text } = review;

    return {
      text: (
        <div>
          <p> {text} </p>
          <dl>
            <dt>Reviewer: </dt>
            <dd> {userName} </dd>
            <dt>Date: </dt>
            <dd> {date} </dd>
          </dl>
        </div>
      ),
      buttons: currentUser?.id === userId ? [
        <button onClick={() => removeReview(reviewId)}> Remove </button>,
        <Link
          to={{
            pathname: `/restaurants/${id}/review`,
            state: { currentReview: review },
          }}
        >
          {" "}
          Edit{" "}
        </Link>,
      ] : [],
    };
  }
}
