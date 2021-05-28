import actions from "./actions";

export default function realmReducer(state, { type, payload = {} }) {
  // console.trace(type, payload);
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
      const {
        restaurant: { restaurantId, reviews, ...restaurant },
        ...restState
      } = state;
      if (restaurantId !== payload.restaurantId) break;
      return {
        restaurant: {
          restaurantId,
          ...restaurant,
          reviews: [...reviews, payload],
        },
        ...restState,
      };
    }

    case actions.EDIT_REVIEW: {
      const {
        restaurant: { restaurantId, reviews, ...restaurant },
        ...restState
      } = state;
      if (restaurantId !== payload.restaurantId) break;
      return {
        restaurant: {
          restaurantId,
          ...restaurant,
          reviews: reviews.map((item) =>
            item.id === payload.id ? payload : item
          ),
        },
        ...restState,
      };
    }

    case actions.DELETE_REVIEW: {
      const {
        restaurant: { restaurantId, reviews, ...restaurant },
        ...restState
      } = state;
      if (restaurantId !== payload.restaurantId) break;
      return {
        restaurant: {
          restaurantId,
          ...restaurant,
          reviews: reviews.filter((item, i) => item.id !== payload.id),
        },
        ...restState,
      };
    }
  }

  return state;
}
