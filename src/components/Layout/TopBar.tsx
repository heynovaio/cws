import { PrismicDocument, RichTextField } from "@prismicio/client";
import { PrismicRichText } from "@prismicio/react";
import LanguageSwitcher from "./LanguageSwitcher";
import { GlobalsDocumentData } from "../../../prismicio-types";

interface TopBarProps {
  text: RichTextField;
  locales: PrismicDocument[];
  global: GlobalsDocumentData | undefined;
}

export const TopBar: React.FC<TopBarProps> = ({ text, locales, global }) => {
  return (
    <div className="bg-gradient-dark w-full text-center py-2 flex-col ">
      <PrismicRichText
        field={text}
        components={{
          paragraph: ({ children }) => <p className="text-base">{children}</p>,
        }}
      />

      {locales && (
        <div className="absolute top-0 right-0 z-[60] ">
          <LanguageSwitcher locales={locales} global={global} />
        </div>
      )}
    </div>
  );
};
