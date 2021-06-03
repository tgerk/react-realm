import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import ReviewCard from "./review/Card";
import Gallery from "../Gallery";

import { useRealm } from "../../services/realm";

export default function Restaurant({ id }) {
  const [{ restaurant = {} }, api] = useRealm(),
    {
      id: restaurantId,
      name,
      description = "[no description]",
      cuisine,
      address,
      reviews = [],
    } = restaurant;

  useEffect(() => {
    api.getRestaurant(id).catch((e) => {
      console.log(e);
    });
  }, [id, api]);

  if (restaurantId !== id) {
    return <p className="loading">Loading...</p>;
  }

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
      <Link to={`/restaurant/${id}/review`} className="btn btn-primary">
        {" "}
        Add Review{" "}
      </Link>
      <h4> Reviews </h4>
      <div className="row">
        {reviews.length > 0 ? (
          <Gallery component={ReviewCard} restaurantId={id} items={reviews} />
        ) : (
          <p className="loading">Be the first to review!</p>
        )}
      </div>
    </div>
  );
}
