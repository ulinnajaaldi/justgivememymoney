import React from "react";

import { Icon } from "@iconify/react";

interface IconifyIconProps {
  icon: string;
  color?: string;
  size?: number | string;
  className?: string;
}

const IconifyIcon: React.FC<IconifyIconProps> = ({
  icon,
  color = "#171717",
  size = 20,
  className,
}) => {
  return (
    <Icon
      icon={icon}
      style={{ color: color ?? "#171717" }}
      width={size}
      height={size}
      className={className}
    />
  );
};

export default IconifyIcon;
