"use client";
import {
  KeyTextField,
  LinkField,
  NumberField,
  RichTextField,
} from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { PrismicRichText } from "@prismicio/react";
import React from "react";
import { FaLaptop, FaMedal } from "react-icons/fa";
import { MdAccessTimeFilled, MdAttachMoney } from "react-icons/md";

interface SpecCardProps {
  title?: string | RichTextField;
  time?: KeyTextField;
  cost?: NumberField;
  certs?: boolean;
  format?: string;
  resources?: LinkField[];
}

// TODO: Translations

export const SpecCard = ({
  title = "Details: ",
  time,
  cost,
  certs,
  format,
  resources,
}: SpecCardProps) => {
  console.log("Resources", resources);
  return (
    <div className="card-white p-5 flex gap-5 flex-col border border-neon-violet">
      {typeof title === "string" ? (
        <label>{title}</label>
      ) : (
        <PrismicRichText field={title} />
      )}
      {time && (
        <div className="flex gap-2 items-center">
          <MdAccessTimeFilled className="h-6 w-6 text-neon-violet" />
          <strong>Time: </strong>
          {time}
        </div>
      )}
      {cost && (
        <div className="flex gap-2 items-center">
          <MdAttachMoney className="h-6 w-6 text-neon-violet" />
          <strong>Cost: </strong>
          {cost}
        </div>
      )}
      {certs && (
        <div className="flex gap-2 items-center">
          <FaMedal className="h-4 w-6 text-neon-violet" />
          <strong>Certs: </strong>
          NCCP PD Points
        </div>
      )}
      {format && (
        <div className="flex gap-2 items-center">
          <FaLaptop className="h-4 w-6 text-neon-violet" />
          <strong>Format: </strong>
          {format}
        </div>
      )}
      {resources && resources.length > 0 && (
        <div className="flex flex-col gap-2">
          <strong>This Program Includes: </strong>
          <ul className="list-disc pl-5">
            {resources.map((item, index) => (
              <li key={index}>
                {item.link_type === "Any" ? (
                  item.text
                ) : (
                  <PrismicNextLink field={item} className="link-no-underline">
                    {item.text}
                  </PrismicNextLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
