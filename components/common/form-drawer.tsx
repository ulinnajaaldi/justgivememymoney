import React from "react";

import { Drawer } from "vaul";

import useDrawer from "@/hook/useDrawer";
import { useMediaQuery } from "@/hook/useMediaQuery";

import { cn } from "@/lib/utils";

import { ScrollArea } from "../ui/scroll-area";

interface FormDrawerProps {
  type: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

const FormDrawer: React.FC<FormDrawerProps> = (props) => {
  const { isOpen, type: drawerType, closeDrawer } = useDrawer();
  const { type, title, description, children } = props;
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (drawerType !== type) return null;

  return (
    <Drawer.Root
      direction="right"
      open={isOpen}
      onOpenChange={(isOpen) => !isOpen && closeDrawer()}
      repositionInputs={false}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Drawer.Content
          className={cn(
            "fixed right-0 z-50 flex w-full flex-col bg-white outline-none md:bottom-0 md:mt-24 md:rounded-t-[10px] lg:max-w-md lg:bg-transparent",
            isMobile ? "inset-y-0 h-[100dvh]" : "h-full",
          )}
        >
          <div
            className={cn(
              "relative m-0 mb-2 flex flex-1 gap-2 overflow-auto bg-white p-2 py-4 md:m-2 md:rounded-l-lg lg:rounded-lg",
              isMobile ? "h-[100dvh] min-h-0" : "h-full",
            )}
          >
            <div className="bg-muted my-auto ml-1 h-[100px] w-2 flex-shrink-0 rounded-full" />

            <div
              className={cn("mx-auto w-full pr-3 pl-1", isMobile ? "pb-6" : "")}
            >
              <div className="mb-4">
                <Drawer.Title className="inline-flex w-full items-center gap-2 text-sm font-medium md:text-base">
                  {title}
                </Drawer.Title>
                {description && (
                  <Drawer.Description className="text-xs text-neutral-500 md:text-sm">
                    {description}
                  </Drawer.Description>
                )}
              </div>
              {children}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default FormDrawer;
