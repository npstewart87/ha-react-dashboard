import React from "react";
import { FloatingSettingsButtonProps } from "./FloatingSettingsButton.types";
import { getMdiIcon } from "@home-assistant-react/icons/src";
import { Box, Flex } from "../../../../primitives/common";
import { useDashboardEditor } from "@home-assistant-react/api/src";
import { cn } from "../../../../helpers";

const classes = {
  Button:
    "rounded-full bg-primary/90 text-primary-foreground shadow-lg p-3 transition-all duration-300 fixed bottom-6 right-6 hover:bg-primary hover:scale-110 hover:shadow-xl cursor-pointer z-sticky",
  ArrangingButton:
    "bg-destructive hover:bg-destructive/90",
};

export const FloatingSettingsButton = React.forwardRef<
  HTMLDivElement,
  FloatingSettingsButtonProps
>((_props, ref) => {
  const { isArranging } = useDashboardEditor();
  return (
    <Flex
      ref={ref}
      className={cn(
        classes.Button,
        isArranging.value && classes.ArrangingButton,
        "items-center justify-center",
      )}
      onClick={isArranging.toggle}
    >
      {getMdiIcon(isArranging.value ? "close" : "pencilRuler", { size: "24px" })}
    </Flex>
  );
});

FloatingSettingsButton.displayName = "FloatingSettingsButton";
