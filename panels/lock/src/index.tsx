import React from "react";
import { Box, Flex } from "@home-assistant-react/ui/src";
import { Icon } from "@home-assistant-react/icons/src";
import { useHassGetEntity } from "@home-assistant-react/api/src/hooks";
import { useHass } from "@home-assistant-react/api/src";
import {
  EditorPropertyType,
  PanelFC,
} from "@home-assistant-react/types/src";
import { mdiLock, mdiLockOpen } from "@mdi/js";

interface LockOptions {
  entity_id?: string;
}

const classes = {
  Wrapper: "w-full h-full px-6 py-4 flex flex-col items-center justify-center",
  IconContainer: "rounded-full p-4 mb-2 cursor-pointer transition-colors",
  Name: "text-md font-semibold leading-5 truncate",
  State: "text-sm mt-1 font-medium capitalize",
};

export const LockPanel: PanelFC<LockOptions> = (props) => {
  const entityId = props.panel.options?.entity_id || "";
  const entity = useHassGetEntity(entityId);
  const hass = useHass();

  const isLocked = entity?.state === "locked";
  const friendlyName = entity?.attributes?.friendly_name || "";
  const stateColor = isLocked ? "#4ade80" : "#ef4444";

  const handleToggle = async () => {
    if (!entityId) return;
    const service = isLocked ? "unlock" : "lock";
    await hass.callService("lock", service, {
      entity_id: entityId,
    });
  };

  return (
    <Box className={classes.Wrapper}>
      <Box
        className={classes.IconContainer}
        style={{ backgroundColor: `${stateColor}20` }}
        onClick={handleToggle}
      >
        <Icon path={isLocked ? mdiLock : mdiLockOpen} size="32px" />
      </Box>
      <Box className={classes.Name}>{friendlyName}</Box>
      <Box className={classes.State} style={{ color: stateColor }}>
        {entity?.state || "unavailable"}
      </Box>
    </Box>
  );
};

LockPanel.isPushButton = true;

LockPanel.suitableForDomains = ["lock"];

LockPanel.configOptions = {
  customOptions: [
    {
      title: "Target",
      options: [
        {
          type: EditorPropertyType.Entity,
          name: "entity_id",
          label: "target_entity",
          domain: "lock",
        },
      ],
    },
  ],
};
