import { useDashboardEditor } from "@home-assistant-react/api/src";
import { Button, Flex, Box } from "@home-assistant-react/ui/src";
import { Heading } from "@home-assistant-react/ui/src/components/data-display/Heading";
import { getMdiIcon } from "@home-assistant-react/icons/src";
import React from "react";

const classes = {
  Wrapper: "absolute inset-0 items-center justify-center flex-col gap-8",
  IconWrapper:
    "w-24 h-24 rounded-full bg-primary/10 items-center justify-center",
  Description: "text-muted-foreground text-center max-w-md text-sm",
};

export const DashboardGridEmptyView: React.FC = () => {
  const { panelsCreationDisclosure, isArranging } = useDashboardEditor();
  const handleAddPanelToGroup = () => {
    panelsCreationDisclosure.open({
      allowDrag: false,
      onAdded: () => {},
    });
    isArranging.setFalse();
  };
  return (
    <Flex className={classes.Wrapper}>
      <Flex className={classes.IconWrapper}>
        {getMdiIcon("viewDashboardOutline", { size: "48px", color: "hsl(var(--primary))" })}
      </Flex>
      <Heading as={"h3"}>This view is empty</Heading>
      <Box className={classes.Description}>
        Add panels to display your Home Assistant entities. You can control
        lights, view sensor data, manage locks, and more.
      </Box>
      <Flex className={"gap-3"}>
        <Button size={"xl"} icon={"Plus"} onClick={handleAddPanelToGroup}>
          Add your first panel
        </Button>
      </Flex>
    </Flex>
  );
};
