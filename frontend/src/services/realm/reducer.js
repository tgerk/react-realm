import actions from "./actions";

export default function realmReducer(state, { type, payload = {} }) {
  console.trace(type, payload);
  switch (type) {
    default:
      return state;
    case actions.GET_CUISINES:
      return { ...state, cuisines: payload };
    case actions.GET_RESTAURANTS:
      return { ...state, restaurants: payload };
    case actions.GET_RESTAURANT:
      return { ...state, restaurant: payload };
    case actions.DELETE_REVIEW:
      const {
          restaurant: { reviews, ...restRestaurant },
          ...restState
        } = state,
        { index, id } = payload;
      return {
        restaurant: {
          reviews: reviews.filter(({ id: review_id }, i) => {
            return review_id !== id && i !== index;
          }),
          ...restRestaurant,
        },
        ...restState,
      };
  }
}
