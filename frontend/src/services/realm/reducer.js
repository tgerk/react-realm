import actions from "./actions";

export default function realmReducer(state, { type, payload = {} }) {
  switch (type) {
    default:
      break;

    case actions.GET_CUISINES:
      return { ...state, cuisines: payload };
    case actions.GET_RESTAURANTS:
      return { ...state, restaurants: payload };
    case actions.GET_RESTAURANT:
      return { ...state, restaurant: payload };

    case actions.ADD_REVIEW: {
      const { restaurant: { reviews, ...restaurant } = {} } = state;
      if (restaurant.id !== payload.restaurantId) break;
      return {
        ...state,
        inFlight: state.inFlight + 1,
        restaurant: {
          ...restaurant,
          reviews: [payload, ...reviews],
        },
      };
    }

    case actions.EDIT_REVIEW: {
      const { restaurant: { reviews, ...restaurant } = {} } = state;
      if (restaurant.id !== payload.restaurantId) break;
      return {
        ...state,
        inFlight: state.inFlight + 1,
        restaurant: {
          ...restaurant,
          reviews: [payload, ...reviews.filter(({ id }) => id !== payload.id)],
        },
      };
    }

    case actions.DELETE_REVIEW: {
      const { restaurant: { reviews, ...restaurant } = {} } = state;
      if (restaurant.id !== payload.restaurantId) break;
      return {
        ...state,
        inFlight: state.inFlight + 1,
        restaurant: {
          ...restaurant,
          reviews: reviews.filter(({ id }) => id !== payload.id),
        },
      };
    }

    case actions.IN_FLIGHT_COMPLETE: {
      return {
        ...state,
        inFlight: state.inFlight - 1,
      };
    }
  }

  return state;
}
