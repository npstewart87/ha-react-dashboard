import React from "react";
import { Box, Flex } from "@home-assistant-react/ui/src";
import { Icon } from "@home-assistant-react/icons/src";
import { useHassGetEntity } from "@home-assistant-react/api/src/hooks";
import { useHass } from "@home-assistant-react/api/src";
import {
  EditorPropertyType,
  PanelFC,
} from "@home-assistant-react/types/src";
import { mdiFan, mdiFanOff } from "@mdi/js";
import { PanelEmptyState } from "@home-assistant-react/ui/src/components/dashboard/panels/PanelEmptyState";

interface FanOptions {
  entity_id?: string;
}

const classes = {
  Wrapper: "w-full h-full px-6 py-4 flex flex-col justify-between",
  Name: "text-md font-semibold leading-5 truncate",
  State: "text-sm opacity-70 mt-1 capitalize",
  Speed: "text-2xl font-bold mt-1",
  ToggleArea: "flex items-center gap-3 mt-2 cursor-pointer",
};

export const FanPanel: PanelFC<FanOptions> = (props) => {
  const entityId = props.panel.options?.entity_id || "";
  const entity = useHassGetEntity(entityId);
  const hass = useHass();

  if (!entity) return <PanelEmptyState icon="fan" message="Select a fan entity" />;

  const isOn = entity?.state === "on";
  const friendlyName = entity?.attributes?.friendly_name || "";
  const percentage = (entity?.attributes?.percentage as number) ?? 0;

  const handleToggle = async () => {
    if (!entityId) return;
    await hass.callService("fan", "toggle", {
      entity_id: entityId,
    });
  };

  return (
    <Box className={classes.Wrapper}>
      <Box>
        <Flex className="items-center gap-2">
          <Icon path={isOn ? mdiFan : mdiFanOff} size="24px" />
          <Box className={classes.Name}>{friendlyName}</Box>
        </Flex>
        <Box className={classes.State}>{entity?.state || "unavailable"}</Box>
        {isOn && (
          <Box className={classes.Speed}>{percentage}%</Box>
        )}
      </Box>
      <Flex className={classes.ToggleArea} onClick={handleToggle}>
        <Box className="text-sm opacity-70">
          Tap to {isOn ? "turn off" : "turn on"}
        </Box>
      </Flex>
    </Box>
  );
};

FanPanel.isPushButton = true;

FanPanel.suitableForDomains = ["fan"];

FanPanel.configOptions = {
  customOptions: [
    {
      title: "Target",
      options: [
        {
          type: EditorPropertyType.Entity,
          name: "entity_id",
          label: "target_entity",
          domain: "fan",
        },
      ],
    },
  ],
};
