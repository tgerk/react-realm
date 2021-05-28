import React from "react";

export default function CardGallery({ title, text, buttons = [] }) {
  return (
    <div className="card">
      <div className="card-body">
        {title && <h5 className="card-title">{title}</h5>}
        <div className="card-text">{text}</div>
        <div className="row">
          {buttons.map((button, i) =>
            React.cloneElement(button, {
              className: "btn btn-primary col-lg-5 mx-1 mb-1",
              key: i,
            })
          )}
        </div>
      </div>
    </div>
  );
}
