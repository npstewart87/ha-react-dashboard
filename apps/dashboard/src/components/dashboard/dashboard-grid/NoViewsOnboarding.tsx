import { useDashboardEditor } from "@home-assistant-react/api/src";
import { Button, Flex, Box } from "@home-assistant-react/ui/src";
import { Heading } from "@home-assistant-react/ui/src/components/data-display/Heading";
import { getMdiIcon } from "@home-assistant-react/icons/src";

const classes = {
  Wrapper: "absolute inset-0 items-center justify-center flex-col gap-8",
  IconWrapper:
    "w-24 h-24 rounded-full bg-primary/10 items-center justify-center",
  Description: "text-muted-foreground text-center max-w-md text-sm",
};

export const NoViewsOnboarding = () => {
  const { editorModalDisclosure } = useDashboardEditor();
  return (
    <Flex className={classes.Wrapper}>
      <Flex className={classes.IconWrapper}>
        {getMdiIcon("tabPlus", { size: "48px", color: "hsl(var(--primary))" })}
      </Flex>
      <Heading as={"h3"}>Welcome to your dashboard</Heading>
      <Box className={classes.Description}>
        Views let you organize your panels into separate tabs. Create your first
        view to start adding panels for your Home Assistant devices.
      </Box>
      <Flex>
        <Button
          size={"xl"}
          icon={"Plus"}
          onClick={() => {
            editorModalDisclosure.open({ modal: "view" });
          }}
        >
          Create your first view
        </Button>
      </Flex>
    </Flex>
  );
};
