"use client";
import { getFormatLabel, ProgramFormat, SupportedLanguage } from "@/constants";
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
  format?: ProgramFormat | "both";
  resources?: LinkField[];
  lang?: SupportedLanguage | string;
}

// TODO: Translations

export const SpecCard = ({
  title = "Details: ",
  time,
  cost,
  certs,
  format,
  resources,
  lang,
}: SpecCardProps) => {
  const validResources = Array.isArray(resources)
    ? resources.filter((item) => item.link_type !== "Any" && item.text)
    : [];

  return (
    <div className="card-white p-5 flex gap-5 flex-col border border-neon-violet font-accent">
      {typeof title === "string" ? (
        <h2 className="text-tagline">{title}</h2>
      ) : (
        <PrismicRichText field={title} />
      )}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-5 text-base">
        {time && (
          <div className="flex flex-col md:flex-row flex-wrap gap-2 items-center text-center md:text-start">
            <MdAccessTimeFilled className="h-6 w-6 text-neon-violet" />
            <span>
              <span className="font-bold">
                {lang === "fr-ca" ? "Temps: " : "Time: "}
              </span>
              {time}
            </span>
          </div>
        )}
        {cost && (
          <div className="flex gap-2 flex-col md:flex-row items-center text-center md:text-start">
            <MdAttachMoney className="h-6 w-6 text-neon-violet" />
            <span>
              <span className="font-bold">
                {lang === "fr-ca" ? "Coût: " : "Cost: "}
              </span>
              ${cost}
            </span>
          </div>
        )}
        {certs && (
          <div className="flex gap-2 flex-col md:flex-row items-center text-center md:text-start">
            <FaMedal className="h-4 w-6 text-neon-violet" />
            <span>
              <span className="font-bold">Certs: </span>
              {lang === "fr-ca" ? "Points PD (NCCP)" : "NCCP PD Points"}
            </span>
          </div>
        )}
        {format && (
          <div className="flex gap-2 flex-col md:flex-row items-center text-center md:text-start">
            <FaLaptop className="h-4 w-6 text-neon-violet" />
            <span>
              <span className="font-bold">Format: </span>
              {getFormatLabel(
                format.toLowerCase() as ProgramFormat,
                lang as "en-ca" | "fr-ca"
              )}
            </span>
          </div>
        )}
      </div>
      {validResources.length > 0 && (
        <div className="w-full flex flex-col mx-auto md:mx-0 gap-2 text-base border-t border-neon-violet pt-3">
          <h3 className="text-base font-bold">
            {lang === "fr-ca" ? "Inclus:" : "Included:"}
          </h3>
          <ul className="list-disc pl-1">
            {validResources.map((item, index) => (
              <li key={index}>
                {item.link_type === "Any" ? (
                  item.text
                ) : (
                  <PrismicNextLink field={item}>{item.text}</PrismicNextLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
