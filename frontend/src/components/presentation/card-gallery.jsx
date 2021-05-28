import React from "react";

import Card from "./card";

export default function CardGallery({ items }) {
  return (
    <div className="row">
      {items.map((item, i) => (
        <div className="col-lg-2 col-md-4 col-sm-6 pb-1" key={i}>
          <Card {...item} />
        </div>
      ))}
    </div>
  );
}
