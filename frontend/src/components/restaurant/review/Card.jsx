import React, { useContext } from "react";
import { Link } from "react-router-dom";

import Card from "../../Card";

import UserContext from "../../../services/user";
import { useRealm } from "../../../services/realm";

export default function ReviewCard({
  restaurantId,
  item: review = {},
  ...props
}) {
  const { id: reviewId, userId, name: userName, date, text } = review,
    [currentUser] = useContext(UserContext),
    [, api] = useRealm();

  function removeReview() {
    api.deleteReview(reviewId, currentUser.id, restaurantId).catch((e) => {
      console.log(e);
    });
  }

  return (
    <Card
      {...props}
      text={
        <div>
          <p> {text} </p>
          <dl>
            <dt>Reviewer: </dt>
            <dd> {userName} </dd>
            <dt>Date: </dt>
            <dd> {date} </dd>
          </dl>
        </div>
      }
      buttons={
        currentUser?.id === userId
          ? [
              <button onClick={removeReview}> Remove </button>,
              <Link
                to={{
                  pathname: `/restaurant/${restaurantId}/review`,
                  state: { currentReview: review },
                }}
              >
                {" "}
                Edit{" "}
              </Link>,
            ]
          : []
      }
    />
  );
}
