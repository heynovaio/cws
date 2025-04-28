import { LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { ReactNode } from "react";

interface ButtonProps {
  buttonType: "primary" | "secondary" | "outline" | "link";
  label: ReactNode;
  linkButtonColorClass?: string;
  buttonLink: LinkField;
  styling?: string;
  icon?: ReactNode;
}

export const Button = ({
  buttonType = "primary",
  label,
  linkButtonColorClass = "",
  buttonLink,
  styling,
  icon = null,
}: ButtonProps) => {
  let buttonStyle = "";

  switch (buttonType) {
    case "primary":
      buttonStyle = "btn btn-primary";
      break;
    case "secondary":
      buttonStyle = "btn btn-secondary";
      break;
    case "outline":
      buttonStyle = "btn btn-outline";
      break;
    case "link":
      buttonStyle = "btn btn-link";
      break;
    default:
      buttonStyle = "btn btn-primary";
  }

  return (
    <PrismicNextLink
      field={buttonLink}
      className={`flex flex-row w-fit items-center gap-2 hover:gap-4 ${styling} ${buttonStyle} ${linkButtonColorClass}`}
    >
      {label}
      {icon && (
        <span className="flex items-center justify-center">
          {icon}
        </span>
      )}
    </PrismicNextLink>
  );
};
