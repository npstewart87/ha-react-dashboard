import React from "react";
import { Box, Flex } from "@home-assistant-react/ui/src";
import { Icon } from "@home-assistant-react/icons/src";
import { useHassGetEntity } from "@home-assistant-react/api/src/hooks";
import { useHass } from "@home-assistant-react/api/src";
import {
  EditorPropertyType,
  PanelFC,
} from "@home-assistant-react/types/src";
import {
  mdiPlay,
  mdiPause,
  mdiSkipNext,
  mdiSkipPrevious,
} from "@mdi/js";

interface MediaPlayerOptions {
  entity_id?: string;
}

const classes = {
  Wrapper: "w-full h-full px-6 py-4 flex flex-col justify-between",
  Name: "text-md font-semibold leading-5 truncate",
  MediaInfo: "text-sm opacity-70 truncate",
  Controls: "flex items-center gap-3 mt-2",
  ControlButton: "cursor-pointer opacity-80 hover:opacity-100 transition-opacity",
};

export const MediaPlayerPanel: PanelFC<MediaPlayerOptions> = (props) => {
  const entityId = props.panel.options?.entity_id || "";
  const entity = useHassGetEntity(entityId);
  const hass = useHass();

  const isPlaying = entity?.state === "playing";
  const mediaTitle = entity?.attributes?.media_title as string | undefined;
  const mediaArtist = entity?.attributes?.media_artist as string | undefined;
  const friendlyName = entity?.attributes?.friendly_name || "";

  const handlePlayPause = async () => {
    if (!entityId) return;
    await hass.callService("media_player", "media_play_pause", {
      entity_id: entityId,
    });
  };

  const handleNext = async () => {
    if (!entityId) return;
    await hass.callService("media_player", "media_next_track", {
      entity_id: entityId,
    });
  };

  const handlePrevious = async () => {
    if (!entityId) return;
    await hass.callService("media_player", "media_previous_track", {
      entity_id: entityId,
    });
  };

  return (
    <Box className={classes.Wrapper}>
      <Box>
        <Box className={classes.Name}>{friendlyName}</Box>
        {mediaTitle && <Box className={classes.MediaInfo}>{mediaTitle}</Box>}
        {mediaArtist && <Box className={classes.MediaInfo}>{mediaArtist}</Box>}
        <Box className={classes.MediaInfo}>{entity?.state || "unavailable"}</Box>
      </Box>
      <Flex className={classes.Controls}>
        <Box className={classes.ControlButton} onClick={handlePrevious}>
          <Icon path={mdiSkipPrevious} size="24px" />
        </Box>
        <Box className={classes.ControlButton} onClick={handlePlayPause}>
          <Icon path={isPlaying ? mdiPause : mdiPlay} size="24px" />
        </Box>
        <Box className={classes.ControlButton} onClick={handleNext}>
          <Icon path={mdiSkipNext} size="24px" />
        </Box>
      </Flex>
    </Box>
  );
};

MediaPlayerPanel.isPushButton = true;

MediaPlayerPanel.suitableForDomains = ["media_player"];

MediaPlayerPanel.configOptions = {
  customOptions: [
    {
      title: "Target",
      options: [
        {
          type: EditorPropertyType.Entity,
          name: "entity_id",
          label: "target_entity",
          domain: "media_player",
        },
      ],
    },
  ],
};
