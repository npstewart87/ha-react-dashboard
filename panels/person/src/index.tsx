import React from "react";
import { Box, Flex } from "@home-assistant-react/ui/src";
import { Icon } from "@home-assistant-react/icons/src";
import { useHassGetEntity } from "@home-assistant-react/api/src/hooks";
import {
  EditorPropertyType,
  PanelFC,
} from "@home-assistant-react/types/src";
import { mdiAccountMultiple } from "@mdi/js";

interface PersonOptions {
  entity_id?: string;
}

const classes = {
  Wrapper: "w-full h-full px-6 py-4 flex flex-col items-center justify-center",
  IconContainer: "rounded-full p-3 mb-2",
  Name: "text-md font-semibold leading-5 truncate",
  State: "text-sm mt-1 font-medium capitalize",
};

export const PersonPanel: PanelFC<PersonOptions> = (props) => {
  const entityId = props.panel.options?.entity_id || "";
  const entity = useHassGetEntity(entityId);

  const friendlyName = entity?.attributes?.friendly_name || "";
  const currentState = entity?.state || "unavailable";
  const isHome = currentState === "home";
  const stateColor = isHome ? "#4ade80" : "#9ca3af";

  return (
    <Box className={classes.Wrapper}>
      <Box
        className={classes.IconContainer}
        style={{ backgroundColor: `${stateColor}20` }}
      >
        <Icon path={mdiAccountMultiple} size="32px" />
      </Box>
      <Box className={classes.Name}>{friendlyName}</Box>
      <Box className={classes.State} style={{ color: stateColor }}>
        {currentState}
      </Box>
    </Box>
  );
};

PersonPanel.suitableForDomains = ["person"];

PersonPanel.configOptions = {
  customOptions: [
    {
      title: "Target",
      options: [
        {
          type: EditorPropertyType.Entity,
          name: "entity_id",
          label: "target_entity",
          domain: "person",
        },
      ],
    },
  ],
};
