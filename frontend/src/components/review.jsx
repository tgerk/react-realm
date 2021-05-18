import React, { useState } from "react";
import { Link } from "react-router-dom";

import { createReview, updateReview } from "../services/restaurant";

export default function Review({ id: restaurantId, currentReview: { _id: reviewId, text: initialText }, currentUser }) {

  // TODO: useContext for user
  const [reviewText, setReview] = useState(initialText);
  const [saved, setSaved] = useState(false);

  const saveReview = () => {
    var review = {
      text: reviewText,
      name: currentUser.name,
      user_id: currentUser.id,
      restaurant_id: restaurantId
    };

    if (reviewId) {
      review._id = reviewId
      updateReview(review)
        .then(response => {
          console.log(response.data);
          setSaved(true);
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      createReview(review)
        .then(response => {
          console.log(response.data);
          setSaved(true);
        })
        .catch(e => {
          console.log(e);
        });
    }

  };

  return (
    <div>
      {currentUser ? (
      <div className="submit-form">
        {saved ? (
          <div>
            <h4>Your review has been saved!</h4>
            <Link to={`/restaurants/${restaurantId}`} className="btn btn-success">
              Back to Restaurant
            </Link>
          </div>
        ) : (
          <div>
            <div className="form-group">
              <label htmlFor="description">{ reviewId ? "Update" : "Create" } Review</label>
              <input
                type="text"
                className="form-control"
                id="text"
                required
                value={reviewText}
                onChange={({ target: { value }}) => setReview(value)}
                name="text"
              />
            </div>
            <button onClick={saveReview} className="btn btn-success">
              Submit
            </button>
          </div>
        )}
      </div>

      ) : (
      <div>
        Please log in.
      </div>
      )}

    </div>
  );
};
