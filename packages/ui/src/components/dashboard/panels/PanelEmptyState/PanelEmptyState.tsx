import React from "react";
import { Flex, Box } from "../../../../primitives/common";
import { getMdiIcon } from "@home-assistant-react/icons/src";

export interface PanelEmptyStateProps {
  icon?: string;
  message?: string;
}

export const PanelEmptyState: React.FC<PanelEmptyStateProps> = ({
  icon = "alertCircleOutline",
  message = "No entity configured",
}) => {
  return (
    <Flex
      className={
        "w-full h-full items-center justify-center flex-col gap-2 p-4 opacity-60"
      }
    >
      <Box className={"text-muted-foreground"}>
        {getMdiIcon(icon, { size: "28px" })}
      </Box>
      <Box className={"text-xs text-muted-foreground text-center"}>
        {message}
      </Box>
    </Flex>
  );
};
