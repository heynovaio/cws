"use client";
import { FC, useRef, useState } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { MaskedPrismicRichText as PrismicRichText } from "@/components/MaskedPrismicRichtext";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Container } from "@/components";
import { BlockQuote } from "@/components/BlockQuote";
import { PrismicNextImage } from "@prismicio/next";
import { FaPlay, FaPause, FaChevronDown } from "react-icons/fa6";
import { JotformEmbed } from "@/components/JotformEmbed";
import { ZohoFormsEmbed } from "@/components/ZohoFormsEmbed";
import { GenericIframeEmbed } from "@/components/GenericIframeEmbed";

export type TabbedContentStickyImageProps =
  SliceComponentProps<Content.TabbedContentStickyImageSlice>;

type Section =
  TabbedContentStickyImageProps["slice"]["primary"]["section"][number];

const getFormEmbed = (tab: Section) => {
  const formUrl = tab.jotform_url;
  const provider = tab.form_provider ?? "JotForm";
  if (!formUrl) return null;
  if (provider === "Zoho Forms") return <ZohoFormsEmbed url={formUrl} />;
  if (provider === "Generic iframe")
    return <GenericIframeEmbed url={formUrl} />;
  return <JotformEmbed url={formUrl} />;
};

const TabbedContentStickyImage: FC<TabbedContentStickyImageProps> = ({
  slice,
}) => {
  const sections = slice.primary.section || [];
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const toggleAudio = (idx: number) => {
    const audio = audioRefs.current[idx];
    if (!audio) return;
    if (playingIndex === idx && !audio.paused) {
      audio.pause();
      setPlayingIndex(null);
    } else {
      audioRefs.current.forEach((a, i) => {
        if (a && i !== idx) a.pause();
      });
      audio
        .play()
        .then(() => setPlayingIndex(idx))
        .catch((err) => console.error("Play failed:", err));
    }
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      data-test-id="tabbed-content-sticky-image"
      className="relative py-8 md:py-16"
      ref={topRef}
      id="pillars"
    >
      <Container>
        <div className="md:hidden flex flex-col gap-4">
          {sections.map((tab, idx) => {
            const formEmbed = getFormEmbed(tab);
            const audioUrl = isFilled.linkToMedia(tab.section_audio_clip)
              ? tab.section_audio_clip.url
              : undefined;

            return (
              <Disclosure key={idx}>
                {({ open }) => (
                  <div
                    className="border border-[#6D00FF] rounded-[12px] overflow-hidden"
                    style={{
                      boxShadow: "0 0 12px 0 rgba(99, 15, 249, 0.8)",
                    }}
                  >
                    <DisclosureButton
                      className={`w-full flex items-center justify-between px-4 py-2 text-left font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3DD2FF] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${
                        open ? "bg-[#6D00FF] text-white" : "text-white"
                      }`}
                    >
                      <div>
                        <div className="text-[1.25rem] font-[600]">
                          {tab.tab_title}
                        </div>
                        {tab.tab_description && (
                          <div className="text-[1rem] font-normal">
                            {tab.tab_description}
                          </div>
                        )}
                      </div>
                      <FaChevronDown
                        className={`transition-transform duration-300 ${
                          open ? "rotate-180" : "rotate-0"
                        }`}
                        aria-hidden="true"
                      />
                    </DisclosureButton>
                    <DisclosurePanel
                      className="p-6"
                      style={{
                        background: "rgba(121, 19, 224, 0.2)",
                        boxShadow: "0 0 30px 0 rgba(99, 15, 249, 0.8)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <div className="flex flex-col gap-6">
                        {tab.section_title && (
                          <h3 className="text-[2rem] font-[600]">
                            {tab.section_title}
                          </h3>
                        )}
                        {tab.section_quote && (
                          <BlockQuote quote={tab.section_quote} />
                        )}
                        {tab.section_text && (
                          <div className="flex flex-col gap-2">
                            <PrismicRichText field={tab.section_text} />
                          </div>
                        )}
                        {formEmbed && (
                          <div className="bg-white w-full rounded text-midnight p-4 flex justify-center items-center">
                            {formEmbed}
                          </div>
                        )}
                        {tab.section_image?.url && (
                          <div className="relative">
                            <PrismicNextImage
                              field={tab.section_image}
                              alt=""
                            />
                            <div
                              className="
                                absolute bottom-2 left-2 w-20 h-20 rounded-full
                                bg-white/50 backdrop-blur-sm border-2 border-[#DD0748]
                                flex items-center justify-center hover:bg-white/80 transition z-50
                                focus-within:ring-4 focus-within:ring-[#DD0748]
                                focus-within:ring-offset-2 focus-within:ring-offset-white
                              "
                            >
                              <button
                                onClick={() => toggleAudio(idx)}
                                type="button"
                                className="inline-flex items-center justify-center rounded-full focus:outline-none"
                                aria-pressed={playingIndex === idx}
                                aria-label={
                                  playingIndex === idx
                                    ? "Pause audio clip"
                                    : "Play audio clip"
                                }
                                aria-controls={`audio-mobile-${idx}`}
                              >
                                {playingIndex === idx ? (
                                  <FaPause
                                    aria-hidden="true"
                                    size="32"
                                    color="#DD0748"
                                  />
                                ) : (
                                  <FaPlay
                                    aria-hidden="true"
                                    size="32"
                                    color="#DD0748"
                                  />
                                )}
                              </button>
                            </div>
                            {audioUrl && (
                              <audio
                                id={`audio-mobile-${idx}`}
                                ref={(el) => {
                                  audioRefs.current[idx] = el;
                                }}
                                src={audioUrl}
                                onEnded={() => setPlayingIndex(null)}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </DisclosurePanel>
                  </div>
                )}
              </Disclosure>
            );
          })}
        </div>

        <div className="hidden md:block">
          <TabGroup>
            <TabList
              aria-label="Sections"
              className="flex mb-4 gap-4 sticky top-0 z-50 w-full"
            >
              {sections.map((tab, idx) => (
                <Tab
                  key={idx}
                  onClick={() =>
                    topRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    })
                  }
                  className={({ selected }) =>
                    [
                      "w-full px-12 py-2 rounded-[12px]",
                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3DD2FF] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                      selected
                        ? "bg-[#6D00FF] text-white font-bold"
                        : "bg-midnight border border-white text-white hover:bg-dark-purple-background",
                    ].join(" ")
                  }
                >
                  <div className="text-[1.25rem] font-[600]">
                    {tab.tab_title}
                  </div>
                  {tab.tab_description && (
                    <div className="text-[1rem] font-normal">
                      {tab.tab_description}
                    </div>
                  )}
                </Tab>
              ))}
            </TabList>

            <TabPanels className="mt-4">
              {sections.map((tab, idx) => {
                const formEmbed = getFormEmbed(tab);
                const audioUrl = isFilled.linkToMedia(tab.section_audio_clip)
                  ? tab.section_audio_clip.url
                  : undefined;

                return (
                  <TabPanel
                    key={idx}
                    className="p-6 rounded-[20px] flex border border-[#6D00FF]"
                    style={{
                      background: "rgba(121, 19, 224, 0.2)",
                      boxShadow: "0 0 30px 0 rgba(99, 15, 249, 0.8)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 flex flex-col gap-8">
                        {tab.section_title && (
                          <h3 className="xs:text-[2.5rem] md:text-[5.5rem] font-[600]">
                            {tab.section_title}
                          </h3>
                        )}
                        {tab.section_quote && (
                          <BlockQuote quote={tab.section_quote} />
                        )}
                        {tab.section_text && (
                          <div className="flex flex-col gap-2">
                            <PrismicRichText field={tab.section_text} />
                          </div>
                        )}
                        {formEmbed && (
                          <div className="bg-white w-full text-midnight rounded-none border mb-4 border-white flex justify-center items-center xs:mt-10 md:mt-0">
                            {formEmbed}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-start">
                        {tab.section_image?.url && (
                          <div
                            className="my-4 sticky flex items-center justify-center"
                            style={{
                              top: "160px",
                              maxHeight: "calc(100vh - 180px)",
                            }}
                          >
                            <div className="relative w-full h-full flex items-center justify-center">
                              <PrismicNextImage
                                field={tab.section_image}
                                alt=""
                                className="max-h-[calc(100vh-180px)] w-auto h-auto object-contain"
                              />
                              <div
                                className="
                                  z-50 absolute bottom-2 left-2 w-32 h-32 rounded-full
                                  bg-white/50 backdrop-blur-sm border-2 border-[#DD0748]
                                  flex items-center justify-center hover:bg-white/80 transition
                                  focus-within:ring-4 focus-within:ring-[#DD0748]
                                  focus-within:ring-offset-2 focus-within:ring-offset-white
                                "
                              >
                                <button
                                  onClick={() => toggleAudio(idx)}
                                  type="button"
                                  className="inline-flex items-center justify-center rounded-full focus:outline-none"
                                  aria-pressed={playingIndex === idx}
                                  aria-label={
                                    playingIndex === idx
                                      ? "Pause audio clip"
                                      : "Play audio clip"
                                  }
                                  aria-controls={`audio-desktop-${idx}`}
                                >
                                  {playingIndex === idx ? (
                                    <FaPause
                                      aria-hidden="true"
                                      size="50"
                                      color="#DD0748"
                                    />
                                  ) : (
                                    <FaPlay
                                      aria-hidden="true"
                                      size="50"
                                      color="#DD0748"
                                    />
                                  )}
                                </button>
                              </div>
                              {audioUrl && (
                                <audio
                                  id={`audio-desktop-${idx}`}
                                  ref={(el) => {
                                    audioRefs.current[idx] = el;
                                  }}
                                  src={audioUrl}
                                  onEnded={() => setPlayingIndex(null)}
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabPanel>
                );
              })}
            </TabPanels>
          </TabGroup>
        </div>
      </Container>
    </section>
  );
};

export default TabbedContentStickyImage;
