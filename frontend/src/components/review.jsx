import React, { useState, useContext } from "react";

import UserContext from "../services/user";
import { useRealm } from "../services/realm";

export default function Review({
  restaurantId,
  currentReview: { id: reviewId, text: initialText },
  history
}) {
  const [currentUser] = useContext(UserContext);
  const [, api] = useRealm();

  const [reviewText, setReview] = useState(initialText);

  const saveReview = () => {
    const updateOrCreate = (data) =>
        reviewId ? api.updateReview(reviewId, data) : api.createReview(data),
      review = {
        restaurantId: restaurantId,
        userId: currentUser.id,
        name: currentUser.name,
        text: reviewText,
      };

    updateOrCreate(review)
      .then(() => {
        history.goBack();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  if (!currentUser) {
    return <div>Sorry! Only logged-in users can leave reviews.</div>;
  }

  return (
    <div className="submit-form">
      <div className="form-group">
        <label htmlFor="description">
          {reviewId ? "Update" : "Create"} Review
        </label>
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
}
