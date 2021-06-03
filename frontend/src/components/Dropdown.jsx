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

  function handleBlurEvent({ currentTarget: us, relatedTarget: them }) {
    if (!them || !us.contains(them)) {
      setOpen(false);
    }
  }

  if (open) {
    return <div onBlur={handleBlurEvent} {...props} />;
  }

  if (affordanceType === "button") {
    return <button onClick={() => setOpen(true)}> {affordanceText} </button>;
  }
}
