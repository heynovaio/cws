"use client";
import { FC, useRef, useState } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Container } from "@/components";
import { BlockQuote } from "@/components/BlockQuote";
import { PrismicNextImage } from "@prismicio/next";
import { FaPlay, FaPause } from "react-icons/fa6";

export type TabbedContentStickyImageProps =
  SliceComponentProps<Content.TabbedContentStickyImageSlice>;

const TabbedContentStickyImage: FC<TabbedContentStickyImageProps> = ({
  slice,
}) => {
  const sections = slice.primary.section || [];
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
      className="relative"
    >
      <Container>
        <TabGroup>
          <TabList className="flex xs:flex-col md:flex-row  mb-4 gap-4">
            {sections.map((tab, idx) => (
              <Tab
                key={idx}
                className={({ selected }) =>
                  `w-full xs:px-4 md:px-12 py-2 rounded-[12px] focus:outline-none ${
                    selected
                      ? "bg-[#6D00FF] text-white font-bold"
                      : "border border-white text-white hover:bg-white/20"
                  }`
                }
              >
                <div className="text-[1.25rem] font-[600]">{tab.tab_title}</div>
                {tab.tab_description && (
                  <div className="text-[1rem] font-normal">
                    {tab.tab_description}
                  </div>
                )}
              </Tab>
            ))}
          </TabList>

          <TabPanels className="mt-4">
            {sections.map((tab, idx) => (
              <TabPanel
                key={idx}
                className="p-6 rounded-[20px] border border-[#6D00FF]"
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

                  <div className="flex-1 flex items-start justify-center">
                    {tab.section_image?.url && (
                      <div className="my-4 sticky top-0">
                        <PrismicNextImage field={tab.section_image} alt="" />

                        <div className="absolute bottom-2 right-2 w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-2 border-[#DD0748] flex items-center justify-center hover:bg-white/60  transition">
                          <button onClick={toggleAudio}>
                            <span>
                              {isPlaying ? (
                                <FaPause size="50" color="#DD0748" />
                              ) : (
                                <FaPlay size="50" color="#DD0748" />
                              )}
                            </span>
                          </button>
                        </div>

                        {(tab.section_audio_clip as any)?.url && (
                          <audio
                            ref={audioRef}
                            src={(tab.section_audio_clip as any).url}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </Container>
    </section>
  );
};

export default TabbedContentStickyImage;
