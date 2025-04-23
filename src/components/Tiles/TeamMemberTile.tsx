import { Button } from "@/app/components/Button";
import { ResponsiveImage } from "../ResponsiveImage/ResponsiveImage";
import { ImageField, KeyTextField, LinkField } from "@prismicio/client";

interface TeamMemberTileProps {
  image?: ImageField;
  name?: KeyTextField;
  position?: KeyTextField;
  link?: LinkField;
  linkLabel?: string;
}

export const TeamMemberTile = ({
  image,
  name,
  position,
  link,
  linkLabel,
}: TeamMemberTileProps) => {
  return (
    <div className="bg-white border border-neon-violet rounded p-4 text-midnight w-full flex flex-col shadow">
      {image && (
        <div className="rounded mb-4 overflow-hidden border border-neon-violet aspect-square rounded">
          <ResponsiveImage
            image={image}
            className="w-full object-cover aspect-square rounded-none"
            imageHeightClassName="h-full "
          />
        </div>
      )}
      {name && <p className="font-extraBold text-bodyLarge ml-1">{name}</p>}
      {position && <p className="text-base ml-1">{position}</p>}
      {link && linkLabel && (
        <Button
          buttonType="link"
          buttonLink={link}
          label={linkLabel}
          styling="text-base ml-1 mt-1"
        />
      )}
    </div>
  );
};
