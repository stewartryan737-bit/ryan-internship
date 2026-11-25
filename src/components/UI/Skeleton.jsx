import React from "react";

const Skeleton = ({ width, height, borderRadius, children }) => {
  if (children) {
    return <div className="row">{children}</div>;
  }

  return (
    <div
      className="skeleton-box"
      style={{
        width,
        height,
        borderRadius,
      }}
    ></div>
  );
};

export default Skeleton;
