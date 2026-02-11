import { PanelFC } from "@home-assistant-react/types/src";
import { PanelEmptyState } from "@home-assistant-react/ui/src/components/dashboard/panels/PanelEmptyState";

export const FallbackPanel: PanelFC<unknown> = () => {
  return <PanelEmptyState icon="alertCircleOutline" message="Unknown panel type" />;
};
