import { Scrollbar } from "react-scrollbars-custom";
import React from "react";

const classes = {
  ScrollArea: "w-full relative flex-grow",
};

export const DashboardGridScrollArea: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <Scrollbar
      className={classes.ScrollArea}
      style={{ width: "100%", height: "100%" }}
      onScroll={(scrollValues) => {
        const target = document.getElementById("dashboard-sections-nav");
        if (!target) return;
        target.style.top = (scrollValues?.currentTarget as HTMLElement)?.scrollTop + "px";
      }}
    >
      {children}
    </Scrollbar>
  );
};
