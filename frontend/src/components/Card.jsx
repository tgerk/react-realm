import React from "react";

export default function Card({ title, text, buttons = [] }) {
  return (
    <article>
      {title && <h1>{title}</h1>}
      <section>{text}</section>
      <aside>
        {buttons.map((button, i) => React.cloneElement(button, { key: i }))}
      </aside>
    </article>
  );
}
