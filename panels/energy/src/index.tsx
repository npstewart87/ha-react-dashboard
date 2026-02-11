import React from "react";
import { Box, Flex } from "@home-assistant-react/ui/src";
import { Icon } from "@home-assistant-react/icons/src";
import { useHassGetEntity } from "@home-assistant-react/api/src/hooks";
import {
  EditorPropertyType,
  PanelFC,
} from "@home-assistant-react/types/src";
import { mdiFlash } from "@mdi/js";
import { PanelEmptyState } from "@home-assistant-react/ui/src/components/dashboard/panels/PanelEmptyState";

interface EnergyOptions {
  entity_id?: string;
}

const classes = {
  Wrapper: "w-full h-full px-6 py-4 flex flex-col justify-between",
  Name: "text-md font-semibold leading-5 truncate",
  Value: "text-2xl font-bold mt-2",
  BarContainer: "w-full h-3 rounded-full bg-gray-700 mt-3 overflow-hidden",
  BarFill: "h-full rounded-full bg-yellow-400 transition-all duration-500",
};

export const EnergyPanel: PanelFC<EnergyOptions> = (props) => {
  const entityId = props.panel.options?.entity_id || "";
  const entity = useHassGetEntity(entityId);
  if (!entity) return <PanelEmptyState icon="flash" message="Select an energy entity" />;

  const friendlyName = entity?.attributes?.friendly_name || "";
  const stateValue = entity?.state || "0";
  const unit = (entity?.attributes?.unit_of_measurement as string) || "";
  const numericValue = parseFloat(stateValue) || 0;

  const maxValue = 100;
  const percentage = Math.min(Math.max((numericValue / maxValue) * 100, 0), 100);

  return (
    <Box className={classes.Wrapper}>
      <Box>
        <Flex className="items-center gap-2">
          <Icon path={mdiFlash} size="24px" />
          <Box className={classes.Name}>{friendlyName}</Box>
        </Flex>
        <Box className={classes.Value}>
          {stateValue} {unit}
        </Box>
      </Box>
      <Box>
        <Box className={classes.BarContainer}>
          <Box
            className={classes.BarFill}
            style={{ width: `${percentage}%` }}
          />
        </Box>
      </Box>
    </Box>
  );
};

EnergyPanel.defaultPanelWidth = 2;
EnergyPanel.defaultPanelHeight = 2;

EnergyPanel.configOptions = {
  customOptions: [
    {
      title: "Target",
      options: [
        {
          type: EditorPropertyType.Entity,
          name: "entity_id",
          label: "target_entity",
        },
      ],
    },
  ],
};
