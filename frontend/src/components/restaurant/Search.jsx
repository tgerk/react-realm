import React, { useState, useEffect, useRef } from "react";

import Dropdown from "../Dropdown";

import { useRealm } from "../../services/realm";
import { useDebouncedEffect } from "../../services/realm";

const ALL_CUISINES = "All Cuisines";

export default function RestaurantsSearch() {
  const focusRef = useRef(),
    [query, setQuery] = useState({}),
    [{ cuisines = [] }, api] = useRealm();

  useEffect(() => {
    api.getCuisines().catch((e) => {
      console.log(e);
    });
  }, [api]);

  const updateQuery = (key, value) => {
    if (value === "" || (key === "cuisine" && value === ALL_CUISINES)) {
      const { [key]: _, ...rest } = query;
      setQuery(rest);
    } else {
      setQuery({ ...query, [key]: value });
    }
  };

  // effect of searching propagates through the useRealm reducer
  // debouncing provides automatic and periodic updates as search parameters change
  useDebouncedEffect(
    () => {
      const req = (() =>
        Object.entries(query).length
          ? api.searchRestaurants(query)
          : api.getRestaurants())();

      req.catch((e) => {
        console.log(e);
      });

      return req.cancel;
    },
    [query, api],
    800
  );

  return (
    <Dropdown
      affordanceType="button"
      affordanceText="Search"
      focusRef={focusRef}
      className="restaurants-search"
    >
      <input
        type="text"
        placeholder="Text search (name or street)"
        value={query.name}
        onChange={({ target: { value } }) => {
          updateQuery("text", value);
        }}
        ref={focusRef}
      />
      <input
        type="text"
        placeholder="Search by zip"
        value={query.zipcode}
        onChange={({ target: { value } }) => {
          updateQuery("zipcode", value);
        }}
      />
      <select
        onChange={({ target: { value } }) => {
          updateQuery("cuisine", value);
        }}
      >
        <option value={ALL_CUISINES}> {ALL_CUISINES} </option>
        {cuisines.map((cuisine, i) => (
          <option value={cuisine} key={i}>
            {" "}
            {cuisine}{" "}
          </option>
        ))}
      </select>
    </Dropdown>
  );
}
