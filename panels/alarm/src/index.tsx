import React from "react";
import { Box, Flex } from "@home-assistant-react/ui/src";
import { Icon } from "@home-assistant-react/icons/src";
import { useHassGetEntity } from "@home-assistant-react/api/src/hooks";
import { useHass } from "@home-assistant-react/api/src";
import {
  EditorPropertyType,
  PanelFC,
} from "@home-assistant-react/types/src";
import { mdiShieldHome, mdiShieldLock, mdiShieldOff } from "@mdi/js";

interface AlarmOptions {
  entity_id?: string;
}

const stateColors: Record<string, string> = {
  disarmed: "#4ade80",
  armed_home: "#facc15",
  armed_away: "#ef4444",
  pending: "#facc15",
  triggered: "#ef4444",
};

const classes = {
  Wrapper: "w-full h-full px-6 py-4 flex flex-col justify-between",
  Name: "text-md font-semibold leading-5 truncate",
  State: "text-sm font-medium mt-1",
  Controls: "flex items-center gap-2 mt-2 flex-wrap",
  Button:
    "px-3 py-1 rounded text-xs font-medium cursor-pointer transition-opacity hover:opacity-80",
};

export const AlarmPanel: PanelFC<AlarmOptions> = (props) => {
  const entityId = props.panel.options?.entity_id || "";
  const entity = useHassGetEntity(entityId);
  const hass = useHass();

  const currentState = entity?.state || "unavailable";
  const friendlyName = entity?.attributes?.friendly_name || "";
  const stateColor = stateColors[currentState] || "#9ca3af";

  const handleArmHome = async () => {
    if (!entityId) return;
    await hass.callService("alarm_control_panel", "alarm_arm_home", {
      entity_id: entityId,
    });
  };

  const handleArmAway = async () => {
    if (!entityId) return;
    await hass.callService("alarm_control_panel", "alarm_arm_away", {
      entity_id: entityId,
    });
  };

  const handleDisarm = async () => {
    if (!entityId) return;
    await hass.callService("alarm_control_panel", "alarm_disarm", {
      entity_id: entityId,
    });
  };

  const stateIcon =
    currentState === "disarmed"
      ? mdiShieldOff
      : currentState === "armed_home"
        ? mdiShieldHome
        : mdiShieldLock;

  return (
    <Box className={classes.Wrapper}>
      <Box>
        <Flex className="items-center gap-2">
          <Icon path={stateIcon} size="24px" />
          <Box className={classes.Name}>{friendlyName}</Box>
        </Flex>
        <Box
          className={classes.State}
          style={{
            color: stateColor,
            animation: currentState === "triggered" ? "pulse 1s infinite" : undefined,
          }}
        >
          {currentState.replace(/_/g, " ")}
        </Box>
      </Box>
      <Flex className={classes.Controls}>
        <Box
          className={classes.Button}
          style={{ backgroundColor: "#facc15", color: "#000" }}
          onClick={handleArmHome}
        >
          Arm Home
        </Box>
        <Box
          className={classes.Button}
          style={{ backgroundColor: "#ef4444", color: "#fff" }}
          onClick={handleArmAway}
        >
          Arm Away
        </Box>
        <Box
          className={classes.Button}
          style={{ backgroundColor: "#4ade80", color: "#000" }}
          onClick={handleDisarm}
        >
          Disarm
        </Box>
      </Flex>
    </Box>
  );
};

AlarmPanel.suitableForDomains = ["alarm_control_panel"];

AlarmPanel.configOptions = {
  customOptions: [
    {
      title: "Target",
      options: [
        {
          type: EditorPropertyType.Entity,
          name: "entity_id",
          label: "target_entity",
          domain: "alarm_control_panel",
        },
      ],
    },
  ],
};
