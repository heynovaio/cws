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
import { useLabels } from "@/providers/LabelProvider";

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
  title,
  time,
  cost,
  certs,
  format,
  resources,
}: SpecCardProps) => {
  const labels = useLabels();

  const displayTitle = title || `${labels.label_details || "Details"}:`;

  return (
    <div className="card-white p-5 flex gap-5 flex-col border border-neon-violet font-accent">
      {typeof displayTitle === "string" ? (
        <label>{displayTitle}</label>
      ) : (
        <PrismicRichText field={displayTitle} />
      )}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-5">
        {time && (
          <div className="flex flex-col md:flex-row flex-wrap gap-2 items-center text-center md:text-start">
            <MdAccessTimeFilled className="h-6 w-6 text-neon-violet" />
            <span>
              <strong>{`${labels.label_time || "Time"}:`} </strong>
              {time}
            </span>
          </div>
        )}
        {cost && (
          <div className="flex gap-2 flex-col md:flex-row items-center text-center md:text-start">
            <MdAttachMoney className="h-6 w-6 text-neon-violet" />
            <span>
              <strong>{`${labels.label_cost || "Cost"}: $`}</strong>
              {cost}
            </span>
          </div>
        )}
        {certs && (
          <div className="flex gap-2 flex-col md:flex-row items-center text-center md:text-start">
            <FaMedal className="h-4 w-6 text-neon-violet" />
            <span>
              <strong>{`${labels.label_certs || "Certs"}:`} </strong>
              {`${labels.label_nccp_pd_points || "NCCP PD Points"}`}{" "}
            </span>
          </div>
        )}
        {format && (
          <div className="flex gap-2 flex-col md:flex-row items-center text-center md:text-start">
            <FaLaptop className="h-4 w-6 text-neon-violet" />
            <span>
              <strong>{`${labels.label_format || "Format"}:`} </strong>
              {format}
            </span>
          </div>
        )}
      </div>
      {resources && resources.length > 0 && (
        <div className="flex flex-col mx-auto md:mx-0 gap-2">
          <strong>
            {`${labels.label_program_includes || "This Program Includes"}:`}{" "}
          </strong>
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
