import React from "react";

import { Drawer } from "vaul";

import useDrawer from "@/hook/useDrawer";

interface FormDrawerProps {
  type: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

const FormDrawer: React.FC<FormDrawerProps> = (props) => {
  const { isOpen, type: drawerType, closeDrawer } = useDrawer();
  const { type, title, description, children } = props;

  if (drawerType !== type) return null;

  return (
    <Drawer.Root
      direction="right"
      open={isOpen}
      onOpenChange={(isOpen) => !isOpen && closeDrawer()}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 right-0 z-50 mt-24 flex h-full w-full flex-col rounded-t-[10px] bg-white outline-none lg:max-w-md lg:bg-transparent">
          <div className="relative m-0 flex h-full flex-1 rounded-l-lg bg-white p-2 pr-4 md:m-2 md:p-4 lg:rounded-lg">
            <div className="my-auto mr-2 h-[100px] w-2 rounded-full bg-muted" />
            <div className="mx-auto w-full">
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
