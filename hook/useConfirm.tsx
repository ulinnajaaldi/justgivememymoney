import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { useMediaQuery } from "./useMediaQuery";

export const useConfirm = (
  title: string,
  message: string,
): [() => JSX.Element, () => Promise<unknown>] => {
  const isMobile = useMediaQuery("(max-width: 980px)");

  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise((resolve, reject) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () =>
    isMobile ? (
      <Drawer open={promise !== null} shouldScaleBackground>
        <DrawerContent>
          <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{message}</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-2">
            <Button onClick={handleConfirm}>Confirm</Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    ) : (
      <Dialog open={promise !== null}>
        <DialogContent disableClose>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

  return [ConfirmationDialog, confirm];
};
