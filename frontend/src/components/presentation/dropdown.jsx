import React, { useEffect, useState } from "react";

export default function Dropdown({
  affordanceType,
  affordanceText,
  focusRef,
  ...props
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      focusRef?.current?.focus();
    }
  }, [focusRef, open]);

  if (open) {
    return (
      <div
        {...props}
        onBlur={({ currentTarget, relatedTarget }) => {
          if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
            setOpen(false);
          }
        }}
      />
    );
  }

  if (affordanceType === "button") {
    return (
      <button onClick={() => setOpen(true)} className="btn btn-success">
        {affordanceText}
      </button>
    );
  }
}
