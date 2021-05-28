import React from "react";

export default function CardGallery({ items }) {
  return (
    <div className="row">
      {items.map(({ title, text, buttons }, i) => (
        <div className="col-lg-2 col-md-4 col-sm-6 pb-1" key={i}>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{title}</h5>
              <p className="card-text">{text}</p>
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
        </div>
      ))}
    </div>
  );
}
