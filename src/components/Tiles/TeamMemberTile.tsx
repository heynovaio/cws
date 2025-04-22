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
    <div className="bg-white border border-neon-violet rounded p-4 text-midnight w-fit flex flex-col  shadow">
      {image && (
        <div className="rounded mb-4 overflow-hidden max-w-[300px] border border-neon-violet ">
          <ResponsiveImage
            image={image}
            className="w-full object-cover rounded"
          />
        </div>
      )}
      <p className="font-extraBold text-bodyLarge">{name}</p>
      <p className="text-base">{position}</p>
    </div>
  );
};
