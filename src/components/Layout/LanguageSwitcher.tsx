"use client";
import { PrismicDocument } from "@prismicio/client";
import { useRouter, usePathname } from "next/navigation";
import { fullLangList } from "@/constants/languages";
import { GlobalsDocumentData } from "../../../prismicio-types";

interface LanguageSwitcherProps {
  locales: PrismicDocument[];
  global: GlobalsDocumentData | undefined;
  classname?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  locales,
  // global,
  classname,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = pathname.split("/")[1];
  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedLocale = locales.find(
      (locale) => locale.lang === event.target.value
    );
    if (selectedLocale && selectedLocale.url) {
      router.push(selectedLocale.url);
    }
  };

  console.log(global);

  return (
    <div className={`print:hidden ${classname}`}>
      <div className="inline-flex items-center  px-2 pt-1">
        <span className="px-1 py-1">
          {/* <strong>{global?.language || "Language"}:</strong> */}
          <strong>Language:</strong>
        </span>

        <select
          id="language-switcher"
          value={currentLang}
          onChange={handleLanguageChange}
          className="bg-transparent px-1 py-1 rounded-lg outline-none focus:ring-2 focus:ring-ultra-pink"
        >
          {locales.map((locale) => (
            <option key={locale.id} value={locale.lang}>
              {fullLangList[locale.lang as keyof typeof fullLangList]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
