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
      console.debug(state.restaurant.id, state.restaurant.restaurantId, payload)
      const { restaurant = {}, ...restState } = state,
        { id: restaurantId, reviews, ...restRestaurant } = restaurant
      if (restaurantId !== payload.restaurantId) break;
      return {
        restaurant: {
          restaurantId,
          ...restRestaurant,
          reviews: [...reviews, payload],
        },
        ...restState,
      };
    }

    case actions.EDIT_REVIEW: {
      console.debug(state.restaurant.id, state.restaurant.restaurantId, payload)
      const { restaurant = {}, ...restState } = state,
        { id: restaurantId, reviews, ...restRestaurant } = restaurant
      if (restaurantId !== payload.restaurantId) break;
      return {
        restaurant: {
          restaurantId,
          ...restRestaurant,
          reviews: reviews.map((item) =>
            item.id === payload.id ? payload : item
          ),
        },
        ...restState,
      };
    }

    case actions.DELETE_REVIEW: {
      console.debug(state.restaurant.id, state.restaurant.restaurantId, payload)
      const { restaurant = {}, ...restState } = state,
        { id: restaurantId, reviews, ...restRestaurant } = restaurant
      if (restaurantId !== payload.restaurantId) break;
      return {
        restaurant: {
          restaurantId,
          ...restRestaurant,
          reviews: reviews.filter(({ id }) => (id !== payload.id)),
        },
        ...restState,
      };
    }
  }

  return state;
}
