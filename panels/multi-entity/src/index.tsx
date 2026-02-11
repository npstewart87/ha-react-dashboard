import React from "react";
import { Box, Flex } from "@home-assistant-react/ui/src";
import { Icon, getDomainIcon } from "@home-assistant-react/icons/src";
import { useHassGetEntity } from "@home-assistant-react/api/src/hooks";
import { getDomainFromEntityId } from "@home-assistant-react/helpers/src/home-assistant";
import {
  EditorPropertyType,
  PanelFC,
} from "@home-assistant-react/types/src";
import { mdiAccountMultiple } from "@mdi/js";

interface MultiEntityOptions {
  entity_ids?: string;
}

const classes = {
  Wrapper: "w-full h-full px-6 py-4 flex flex-col overflow-auto",
  Header: "text-md font-semibold leading-5 mb-3",
  EntityRow: "flex items-center gap-2 py-1 border-b border-gray-700 last:border-0",
  EntityName: "flex-grow text-sm truncate",
  EntityState: "text-sm opacity-70 whitespace-nowrap",
};

const EntityRow: React.FC<{ entityId: string }> = ({ entityId }) => {
  const entity = useHassGetEntity(entityId.trim());
  if (!entity) return null;

  const domain = getDomainFromEntityId(entity.entity_id);
  const iconPath = getDomainIcon(domain, entity);

  return (
    <Flex className={classes.EntityRow}>
      <Icon path={iconPath} size="18px" />
      <Box className={classes.EntityName}>
        {entity.attributes?.friendly_name || entity.entity_id}
      </Box>
      <Box className={classes.EntityState}>{entity.state}</Box>
    </Flex>
  );
};

export const MultiEntityPanel: PanelFC<MultiEntityOptions> = (props) => {
  const entityIdsRaw = props.panel.options?.entity_ids || "";
  const entityIds = entityIdsRaw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return (
    <Box className={classes.Wrapper}>
      <Flex className="items-center gap-2 mb-2">
        <Icon path={mdiAccountMultiple} size="20px" />
        <Box className={classes.Header}>Entities</Box>
      </Flex>
      {entityIds.length === 0 && (
        <Box className="text-sm opacity-50">No entities configured</Box>
      )}
      {entityIds.map((entityId) => (
        <EntityRow key={entityId} entityId={entityId} />
      ))}
    </Box>
  );
};

MultiEntityPanel.defaultPanelWidth = 2;
MultiEntityPanel.defaultPanelHeight = 3;
MultiEntityPanel.isGroupPanel = true;

MultiEntityPanel.configOptions = {
  customOptions: [
    {
      title: "Entities",
      options: [
        {
          type: EditorPropertyType.Text,
          name: "entity_ids",
          label: "Entity IDs (comma-separated)",
        },
      ],
    },
  ],
};
