import { FC } from "react";
import { Content, isFilled, LinkField } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import { Button, Container } from "@/components";
import {
  HeroCopyReveal,
  HeroLogoAnimation,
  HeroPlayers,
} from "@/components/AnimatedLogo/HeroLogoAnimation";
import { optionalBannerBackground } from "@/components/Layout/Section";
import { components, hasContent } from "@/utils";
import { maskPrismicUrl } from "@/utils/maskPrismicMediaUrl";

export type HeroProps = SliceComponentProps<Content.HeroSlice>;

const HEIGHT_CLASS: Record<string, string> = {
  Screen: "min-h-screen",
  "75%": "min-h-[75vh]",
  "50%": "min-h-[50vh]",
  "33%": "min-h-[33vh]",
};

const VERTICAL_CLASS: Record<string, string> = {
  Top: "justify-start",
  Middle: "justify-center",
  Bottom: "justify-end",
};

const HORIZONTAL_CLASS: Record<string, string> = {
  Left: "items-start text-left",
  Center: "items-center text-center",
  Right: "items-end text-right",
};

const OVERLAY_CLASS: Record<string, string> = {
  "0%": "",
  "10%": "bg-midnight/10",
  "20%": "bg-midnight/20",
  "30%": "bg-midnight/30",
  "40%": "bg-midnight/40",
  "50%": "bg-midnight/50",
  "60%": "bg-midnight/60",
  "70%": "bg-midnight/70",
  "80%": "bg-midnight/80",
  "90%": "bg-midnight/90",
  "100%": "bg-midnight",
};

type HeroMedia = { url: string; kind: string; name: string };

function asMediaLink(field: LinkField): HeroMedia | null {
  if (
    !isFilled.link(field) ||
    field.link_type !== "Media" ||
    !("url" in field) ||
    !field.url
  ) {
    return null;
  }

  return {
    url: field.url,
    kind: "kind" in field ? String(field.kind) : "",
    name: "name" in field ? String(field.name) : "",
  };
}

function isVideoMedia(media: HeroMedia): boolean {
  const probe = `${media.kind} ${media.name} ${media.url}`.toLowerCase();
  return (
    probe.includes("video") || /\.(mp4|webm|ogg|mov|m4v)(\?|$)/.test(probe)
  );
}

function mediaSrc(media: HeroMedia): string {
  if (media.url.includes("prismic.io")) {
    return String(maskPrismicUrl(media.url));
  }
  return media.url;
}

const Hero: FC<HeroProps> = ({ slice }) => {
  const { primary } = slice;
  const media = asMediaLink(primary.media);
  const hasDescription = hasContent(primary.description);
  const linkLabel =
    primary.link_label ||
    (isFilled.link(primary.link) && "text" in primary.link
      ? primary.link.text
      : "") ||
    "";
  const hasLink = isFilled.link(primary.link) && Boolean(linkLabel);

  const isStacked = slice.variation === "heroStacked";
  const isAnimated = slice.variation === "animatedHero";

  if (!isAnimated && !media && !hasDescription && !hasLink) return null;
  const textClass =
    primary.text_color === "Black" ? "text-midnight" : "text-white";
  const heightClass = HEIGHT_CLASS[primary.height ?? ""] ?? "min-h-[75vh]";
  const verticalClass =
    VERTICAL_CLASS[primary.content_vertical_placement ?? ""] ??
    "justify-center";
  const horizontalClass =
    HORIZONTAL_CLASS[primary.horizontal_vertical_placement ?? ""] ??
    "items-start text-left";
  const overlayClass =
    OVERLAY_CLASS[primary.overlay_opacity ?? "10%"] ?? "bg-midnight/10";

  const mediaElement =
    media && isVideoMedia(media) ? (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={mediaSrc(media)}
        autoPlay
        muted
        loop
        playsInline
      />
    ) : media ? (
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src={mediaSrc(media)}
        alt=""
      />
    ) : null;

  const copy = (
    <div
      className={`flex w-full max-w-[900px] flex-col gap-6 ${horizontalClass}`}
    >
      {hasDescription && (
        <PrismicRichText field={primary.description} components={components} />
      )}
      {hasLink && (
        <Button
          buttonType="primary"
          buttonLink={primary.link}
          label={linkLabel}
        />
      )}
    </div>
  );

  if (slice.variation === "animatedHero") {
    const animatedHeight = HEIGHT_CLASS[primary.height ?? ""] ?? "min-h-screen";
    const mobileStackBackground = optionalBannerBackground(
      slice.primary.background_color
    );

    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className={`relative flex w-full flex-col overflow-hidden bg-[#0b0a24] md:block ${animatedHeight} ${textClass}`}
      >
        <div className="relative h-[70vh] w-full shrink-0 md:absolute md:inset-0 md:h-auto">
          {mediaElement}
          {overlayClass && (
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-0 ${overlayClass}`}
            />
          )}
          <HeroLogoAnimation />
          <HeroPlayers src="/cws-volleyball-players.png" />
        </div>
        {(hasDescription || hasLink) && (
          <>
            <div
              className={`md:hidden ${mobileStackBackground || "section-bg-gradient"}`}
            >
              <Container
                containerClassName={`relative z-20 flex flex-col py-16 ${verticalClass} ${horizontalClass}`}
              >
                <HeroCopyReveal>{copy}</HeroCopyReveal>
              </Container>
            </div>
            <Container
              containerClassName={`section-bg-gradient relative z-20 hidden flex-col py-16 md:absolute md:inset-0 md:flex md:min-h-full ${verticalClass} ${horizontalClass}`}
            >
              <HeroCopyReveal>{copy}</HeroCopyReveal>
            </Container>
          </>
        )}
      </section>
    );
  }

  if (isStacked) {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
        className={`relative w-full ${textClass}`}
      >
        {mediaElement && (
          <div className={`relative w-full overflow-hidden ${heightClass}`}>
            {mediaElement}
            {overlayClass && (
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 ${overlayClass}`}
              />
            )}
          </div>
        )}
        {(hasDescription || hasLink) && (
          <div
            className={`w-full ${optionalBannerBackground(slice.primary.background_color)}`}
          >
            <Container
              containerClassName={`flex flex-col py-12 ${horizontalClass}`}
            >
              {copy}
            </Container>
          </div>
        )}
      </section>
    );
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className={`relative flex w-full overflow-hidden ${heightClass} ${textClass}`}
    >
      {mediaElement}
      {overlayClass && (
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 z-[1] ${overlayClass}`}
        />
      )}

      <Container
        containerClassName={`relative z-10 flex flex-1 flex-col py-16 ${verticalClass} ${horizontalClass}`}
      >
        {copy}
      </Container>
    </section>
  );
};

export default Hero;
