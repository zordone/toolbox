import React, { FC } from "react";

interface IconProps {
  iconStyle?: string;
  name: string;
}

const Icon: FC<IconProps> = ({ iconStyle = "fas", name }) => (
  <i className={`${iconStyle} ${name}`}></i>
);

export default Icon;
