import React from "react";
import { PanelEditButtonProps } from "./PanelEditButton.types";
import { getMdiIcon } from "@home-assistant-react/icons/src";
import { Flex } from "../../../../primitives/common";

export const PanelEditButton = React.forwardRef<
  HTMLDivElement,
  PanelEditButtonProps
>((props, ref) => {
  return (
    <Flex
      ref={ref}
      onClick={(event) => {
        event.stopPropagation();
        event.preventDefault();
        props.onClick?.(event);
      }}
      className={
        "z-docked absolute right-2 top-2 w-8 h-8 rounded-full bg-primary/90 text-primary-foreground items-center justify-center cursor-pointer hover:bg-primary hover:scale-110 transition-all duration-200 shadow-md"
      }
    >
      {getMdiIcon("pencil", { size: "16px" })}
    </Flex>
  );
});

PanelEditButton.displayName = "PanelEditButton";
