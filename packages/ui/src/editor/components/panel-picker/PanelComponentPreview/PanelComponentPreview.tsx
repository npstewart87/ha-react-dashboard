import React from "react";
import { PanelComponentPreviewProps } from "./PanelComponentPreview.types";
import { Box, Flex } from "../../../../primitives/common";
import { PanelCard } from "../../../../components";
import { PanelProvider } from "@home-assistant-react/providers/src";
import { NewPanelDragData } from "@home-assistant-react/types/src";

const panelDescriptions: Record<string, string> = {
  Action: "Trigger scripts and actions",
  Alarm: "Alarm control panel",
  Camera: "Live camera feed",
  Climate: "Temperature and HVAC control",
  Clock: "Digital clock display",
  Cover: "Blinds and shade control",
  Energy: "Energy usage monitor",
  Fan: "Fan speed control",
  Light: "Light brightness and color",
  Lock: "Lock and unlock doors",
  MediaPlayer: "Media playback controls",
  MultiEntity: "Display multiple entities",
  Person: "Person presence tracking",
  Sensor: "Sensor data and charts",
  Slideshow: "Image slideshow carousel",
  Stack: "Container for other panels",
  Toggle: "On/off switch control",
  Vacuum: "Robot vacuum control",
  Waste: "Waste collection schedule",
  Weather: "Weather forecast display",
};

function formatPanelName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

const classes = {
  Wrapper:
    "flex flex-col overflow-hidden border border-border rounded-lg hover:shadow-lg hover:border-primary/30 cursor-pointer transition-all duration-200",
  Title:
    "bg-secondary/40 border-b border-border px-3 py-2.5 text-sm font-medium flex items-center gap-2",
  PanelPreview:
    "items-center justify-center py-4 px-6 bg-secondary/20 flex-grow pointer-events-none min-h-[80px]",
  Card: "w-full",
};

export const PanelComponentPreview = React.forwardRef<
  HTMLDivElement,
  PanelComponentPreviewProps
>((props, ref) => {
  const { panel, onDragStart, panelKey, ...rest } = props;
  const previewPanelRef = React.useRef<HTMLDivElement>(null);
  const description =
    panel.previewPanelDescription ||
    panelDescriptions[panelKey] ||
    `${formatPanelName(panelKey)} panel`;

  return (
    <PanelProvider value={{ isPreview: true }}>
      <Flex
        ref={ref}
        {...rest}
        onDragStart={
          onDragStart || rest.draggable
            ? (event) => {
                const dragData: NewPanelDragData = {
                  type: "new-panel",
                  component: panelKey,
                };
                if (previewPanelRef.current) {
                  event.dataTransfer.setDragImage(
                    previewPanelRef.current,
                    0,
                    0,
                  );
                }
                onDragStart?.(event, dragData);
              }
            : undefined
        }
        className={classes.Wrapper}
      >
        <Box className={classes.Title}>
          {panel.getIcon?.({ size: "18px" })}
          {formatPanelName(panelKey)}
        </Box>
        <Flex className={classes.PanelPreview}>
          <Box ref={previewPanelRef}>
            {panel.previewPanel ? (
              <PanelCard className={classes.Card} panelComponent={panelKey}>
                {React.createElement(panel.previewPanel)}
              </PanelCard>
            ) : (
              <Box className={"text-sm text-muted-foreground text-center"}>
                {description}
              </Box>
            )}
          </Box>
        </Flex>
      </Flex>
    </PanelProvider>
  );
});

PanelComponentPreview.displayName = "PanelComponentPreview";
