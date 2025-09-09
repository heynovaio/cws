import { LinkField } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { ReactNode } from "react";

interface ButtonProps {
  as?: "link" | "button";
  type?: "button" | "submit";
  buttonType: "primary" | "secondary" | "outline" | "link" | "text";
  label: ReactNode;
  linkButtonColorClass?: string;
  buttonLink?: LinkField;
  styling?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export const Button = ({
  as = "link",
  type = "button",
  buttonType = "primary",
  label,
  linkButtonColorClass = "",
  buttonLink,
  styling,
  icon = null,
  onClick,
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

  if (as === "button") {
    return (
      <button
        type={type}
        className={`flex flex-row w-fit items-center gap-2 hover:gap-4 ${styling} ${buttonStyle} ${linkButtonColorClass}`}
        onClick={onClick}
      >
        {label || "Submit"}
        {icon && (
          <span className="flex items-center justify-center">{icon}</span>
        )}
      </button>
    );
  }

  if (!buttonLink || !label) return null;

  return (
    <PrismicNextLink
      target={
        buttonLink.link_type === "Media" ? "_blank" : (buttonLink as any).target
      }
      field={buttonLink}
      className={`flex flex-row w-fit items-center gap-2 hover:gap-4 ${styling} ${buttonStyle} ${linkButtonColorClass}`}
    >
      {label}
      {icon && <span className="flex items-center justify-center">{icon}</span>}
    </PrismicNextLink>
  );
};
