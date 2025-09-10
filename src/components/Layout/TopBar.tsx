import { PrismicDocument, RichTextField } from "@prismicio/client";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import LanguageSwitcher from "./LanguageSwitcher";
import { GlobalsDocumentData } from "../../../prismicio-types";

interface TopBarProps {
  text: RichTextField;
  locales: PrismicDocument[];
  global: GlobalsDocumentData | undefined;
}

export const TopBar: React.FC<TopBarProps> = ({ text, locales, global }) => {
  return (
    <div className="bg-midnight bg-gradient-dark w-full text-center px-2 md:px-0 py-2 flex-col">
      <PrismicRichText
        field={text}
        components={{
          paragraph: ({ children }) => (
            <p className="text-[1rem] small-link mt-2">{children}</p>
          ),
        }}
      />

      {locales && (
        <div className="absolute top-0 right-4 z-[60] ">
          <LanguageSwitcher
            locales={locales}
            global={global}
            classname="hidden md:block mt-2"
          />
        </div>
      )}
    </div>
  );
};
