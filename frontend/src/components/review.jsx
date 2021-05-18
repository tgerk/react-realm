import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import UserContext from "../services/user";
import { createReview, updateReview } from "../services/restaurant";

export default function Review({ id: restaurantId, currentReview: { _id: reviewId, text: initialText } }) {

  const [currentUser] = useContext(UserContext);
  const [saved, setSaved] = useState(false);
  const [reviewText, setReview] = useState(initialText);

  const saveReview = () => {
    (review => reviewId ? updateReview({ ...review, _id: reviewId }) : createReview(review))({
      text: reviewText,
      name: currentUser.name,
      user_id: currentUser.id,
      restaurant_id: restaurantId
    })
      .then(response => {
        console.log(response.data);
        setSaved(true);
      })
      .catch(e => {
        console.log(e);
      });
  }

  if (saved) {
    return (
      <div>
        <h4>Your review has been saved!</h4>
        <Link to={`/restaurants/${restaurantId}`} className="btn btn-success">
          Back to Restaurant
          </Link>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div>
        Please log in.
      </div>
    )
  }

  return (
    <div className="submit-form">
      <div className="form-group">
        <label htmlFor="description">{reviewId ? "Update" : "Create"} Review</label>
        <input
          type="text"
          className="form-control"
          id="text"
          required
          value={reviewText}
          onChange={({ target: { value } }) => setReview(value)}
          name="text"
        />
      </div>
      <button onClick={saveReview} className="btn btn-success">
        Submit
      </button>
    </div>
  );

};
