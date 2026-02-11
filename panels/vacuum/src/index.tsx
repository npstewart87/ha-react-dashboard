import React from "react";
import { Box, Flex } from "@home-assistant-react/ui/src";
import { Icon } from "@home-assistant-react/icons/src";
import { useHassGetEntity } from "@home-assistant-react/api/src/hooks";
import { useHass } from "@home-assistant-react/api/src";
import {
  EditorPropertyType,
  PanelFC,
} from "@home-assistant-react/types/src";
import { mdiRobotVacuum, mdiPlay, mdiStop, mdiHome } from "@mdi/js";

interface VacuumOptions {
  entity_id?: string;
}

const classes = {
  Wrapper: "w-full h-full px-6 py-4 flex flex-col justify-between",
  Name: "text-md font-semibold leading-5 truncate",
  State: "text-sm opacity-70 mt-1 capitalize",
  Battery: "text-sm opacity-70",
  Controls: "flex items-center gap-3 mt-2",
  ControlButton:
    "cursor-pointer opacity-80 hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10",
};

export const VacuumPanel: PanelFC<VacuumOptions> = (props) => {
  const entityId = props.panel.options?.entity_id || "";
  const entity = useHassGetEntity(entityId);
  const hass = useHass();

  const friendlyName = entity?.attributes?.friendly_name || "";
  const currentState = entity?.state || "unavailable";
  const batteryLevel = entity?.attributes?.battery_level as number | undefined;

  const handleStart = async () => {
    if (!entityId) return;
    await hass.callService("vacuum", "start", {
      entity_id: entityId,
    });
  };

  const handleStop = async () => {
    if (!entityId) return;
    await hass.callService("vacuum", "stop", {
      entity_id: entityId,
    });
  };

  const handleReturnToBase = async () => {
    if (!entityId) return;
    await hass.callService("vacuum", "return_to_base", {
      entity_id: entityId,
    });
  };

  return (
    <Box className={classes.Wrapper}>
      <Box>
        <Flex className="items-center gap-2">
          <Icon path={mdiRobotVacuum} size="24px" />
          <Box className={classes.Name}>{friendlyName}</Box>
        </Flex>
        <Box className={classes.State}>{currentState}</Box>
        {batteryLevel !== undefined && (
          <Box className={classes.Battery}>Battery: {batteryLevel}%</Box>
        )}
      </Box>
      <Flex className={classes.Controls}>
        <Box className={classes.ControlButton} onClick={handleStart}>
          <Icon path={mdiPlay} size="22px" />
        </Box>
        <Box className={classes.ControlButton} onClick={handleStop}>
          <Icon path={mdiStop} size="22px" />
        </Box>
        <Box className={classes.ControlButton} onClick={handleReturnToBase}>
          <Icon path={mdiHome} size="22px" />
        </Box>
      </Flex>
    </Box>
  );
};

VacuumPanel.suitableForDomains = ["vacuum"];

VacuumPanel.configOptions = {
  customOptions: [
    {
      title: "Target",
      options: [
        {
          type: EditorPropertyType.Entity,
          name: "entity_id",
          label: "target_entity",
          domain: "vacuum",
        },
      ],
    },
  ],
};
