"use client";
import { FC, useRef, useState } from "react";
import { Content } from "@prismicio/client";
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

export type TabbedContentStickyImageProps =
  SliceComponentProps<Content.TabbedContentStickyImageSlice>;

const TabbedContentStickyImage: FC<TabbedContentStickyImageProps> = ({
  slice,
}) => {
  const sections = slice.primary.section || [];
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      data-test-id="tabbed-content-sticky-image"
      className="relative"
      ref={topRef}
    >
      <Container>
        <div className="md:hidden flex flex-col gap-4">
          {sections.map((tab, idx) => {
            const jotformUrl = tab.jotform_url;
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
                      className={`w-full flex items-center justify-between px-4 py-2 text-left font-semibold ${
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
                      />
                    </DisclosureButton>
                    <DisclosurePanel
                      className="p-6 "
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
                        {jotformUrl ? (
                          <div className="bg-white w-full rounded text-midnight p-4 flex justify-center items-center">
                            <JotformEmbed url={jotformUrl} />
                          </div>
                        ) : null}
                        {tab.section_image?.url && (
                          <div className="relative">
                            <PrismicNextImage
                              field={tab.section_image}
                              alt=""
                            />

                            <div className="absolute bottom-2 right-2 w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-[#DD0748] flex items-center justify-center hover:bg-white/60 transition">
                              <button onClick={toggleAudio}>
                                {isPlaying ? (
                                  <FaPause size="32" color="#DD0748" />
                                ) : (
                                  <FaPlay size="32" color="#DD0748" />
                                )}
                              </button>
                            </div>
                            {tab.section_audio_clip &&
                              "url" in tab.section_audio_clip &&
                              tab.section_audio_clip.url && (
                                <audio
                                  ref={audioRef}
                                  src={tab.section_audio_clip.url}
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
            <TabList className="flex mb-4 gap-4 sticky top-0 z-50 w-full ">
              {sections.map((tab, idx) => (
                <Tab
                  onClick={() => {
                    topRef.current?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  key={idx}
                  className={({ selected }) =>
                    `w-full px-12 py-2 rounded-[12px] focus:outline-none ${
                      selected
                        ? "bg-[#6D00FF] text-white font-bold"
                        : " bg-midnight border border-white text-white hover:bg-dark-purple-background"
                    }`
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
                const jotformUrl = tab.jotform_url;
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
                      </div>

                      <div className="flex-1 flex flex-col items-center justify-start">
                        {tab.section_image?.url && (
                          <div
                            className="w-full sticky flex flex-col gap-4"
                            style={{
                              top: "160px",
                              maxHeight: "calc(100vh - 180px)",
                            }}
                          >
                            {jotformUrl ? (
                              <div className="bg-white w-full rounded text-midnight p-4 flex justify-center items-center">
                                <JotformEmbed url={jotformUrl} />
                              </div>
                            ) : null}
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
                                  className="max-h-[500px] w-auto h-auto object-contain"
                                />
                                <div className="absolute bottom-2 right-16 w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-2 border-[#DD0748] flex items-center justify-center hover:bg-white/60 transition">
                                  <button onClick={toggleAudio}>
                                    {isPlaying ? (
                                      <FaPause size="50" color="#DD0748" />
                                    ) : (
                                      <FaPlay size="50" color="#DD0748" />
                                    )}
                                  </button>
                                </div>
                              </div>
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
