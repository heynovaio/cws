import { ResponsiveImage } from "../ResponsiveImage/ResponsiveImage";
import { ImageField, KeyTextField } from "@prismicio/client";

interface TeamMemberTileProps {
  image: ImageField;
  name: KeyTextField;
  position: KeyTextField;
}

export const TeamMemberTile = ({
  image,
  name,
  position,
}: TeamMemberTileProps) => {
  return (
    <div className="bg-white border border-neon-violet rounded p-4 text-midnight w-full flex flex-col shadow">
      {image && (
        <div className="rounded mb-4 overflow-hidden border border-neon-violet aspect-square">
          <ResponsiveImage
            image={image}
            className="w-full object-cover rounded"
            imageHeightClassName="h-full"
          />
        </div>
      )}
      <p className="font-extraBold text-bodyLarge ml-1">{name}</p>
      <p className="text-base ml-1">{position}</p>
    </div>
  );
};
