import React, { useEffect, useState } from "react"

export function Dropdown({ affordanceType, affordanceText, focusRef, ...props }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) {
      focusRef?.current?.focus()
    }
  }, [focusRef, open])

  if (open) {
    return (
      <div {...props} onBlur={({ currentTarget, relatedTarget }) => {
        if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
          setOpen(false)
        }
      }} />
    )
  }

  if (affordanceType === "button") {
    return (
      <button onClick={() => setOpen(true)} className="btn btn-success">
        {affordanceText}
      </button>
    )
  }
}

export function CardGallery({ items }) {
  return (
    <div className="row">
      {items.map(({ title, text, buttons }, i) => (
        <div className="col-lg-2 col-md-4 col-sm-6 pb-1" key={i}>
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{title}</h5>
              <p className="card-text">
                {text}
              </p>
              <div className="row">
                {buttons.map(button => React.cloneElement(button, { className: "btn btn-primary col-lg-5 mx-1 mb-1" }))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
