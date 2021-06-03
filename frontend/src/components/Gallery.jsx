import React from "react";

export default function Gallery({ component: Component, items, ...props }) {
  return (
    <div className="gallery">
      {items.map((item, i) => (
        <Component item={item} key={i} {...props} />
      ))}
    </div>
  );
}
