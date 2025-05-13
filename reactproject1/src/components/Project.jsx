import React from "react";

export default function Project({ name, onDoubleClick }) {
  return (
    <li onDoubleClick={() => onDoubleClick(name)}>
      {name}
    </li>
  );
}