import React from "react";

const Icon = ({ name, iconStyle = "fas" }) => (
  <i className={`${iconStyle} ${name}`}></i>
);

export default Icon;
