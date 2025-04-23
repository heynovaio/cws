import { LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { ReactNode } from "react";

interface ButtonProps {
  buttonType: "primary" | "secondary" | "outline" | "link";
  label: ReactNode;
  linkButtonColorClass?: string;
  buttonLink: LinkField;
  styling?: string;
}

const arrowIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
    />
  </svg>
);

export const Button = ({
  buttonType = "primary",
  label,
  linkButtonColorClass = "",
  buttonLink,
  styling,
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
      {buttonType == "link" && arrowIcon}
    </PrismicNextLink>
  );
};
