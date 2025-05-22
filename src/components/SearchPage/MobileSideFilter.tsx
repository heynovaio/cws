import { Button, CloseButton, Dialog, DialogPanel } from "@headlessui/react";
import React, { useState } from "react";
import { VscSettings } from "react-icons/vsc";
import { SideFilter } from "./SideFilter";
import { useWindowSize } from "@/hooks";
import { FaXmark } from "react-icons/fa6";

export const MobileSideFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const windowSize = useWindowSize();
  const isMobile = windowSize.width < 768;

  const handleFilterClick = () => {
    setIsOpen(true);
  };

  if (!isMobile) {
    return null;
  }

  return (
    <div className="flex md:hidden w-full">
      <Button
        onClick={handleFilterClick}
        className="self-start btn btn-outline border focus flex items-center gap-2 justify-center"
      >
        Filters
        <VscSettings className="h-5 w-5" />
      </Button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed bg-dark-purple-background pb-6 inset-0 flex w-full overflow-auto">
          <DialogPanel
            transition
            className="w-full rounded-xl px-5 py-8 duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0"
          >
            <CloseButton
              className="z-20 fixed top-4 right-4 p-5 btn-primary rounded-full duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
              onClick={() => setIsOpen(false)}
            >
              <FaXmark className="h-5 w-5" />
            </CloseButton>
            <SideFilter />
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};
