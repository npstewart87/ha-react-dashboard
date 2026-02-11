//import { CoverPanel } from "@home-assistant-react/panel-cover/src";
import { ActionPanel } from "@home-assistant-react/panel-action/src";
import { AlarmPanel } from "@home-assistant-react/panel-alarm/src";
import { CameraPanel } from "@home-assistant-react/panel-camera/src";
import { ClimatePanel } from "@home-assistant-react/panel-climate/src";
import { Clock } from "@home-assistant-react/panel-clock/src";
import { registerPanelComponent } from "@home-assistant-react/api/src/dashboard";
import { CoverPanel } from "@home-assistant-react/panel-cover/src";
import { EnergyPanel } from "@home-assistant-react/panel-energy/src";
import { FanPanel } from "@home-assistant-react/panel-fan/src";
import { Stack } from "@home-assistant-react/panel-stack/src";
import { FallbackPanel } from "@home-assistant-react/panel-fallback/src";
import { LockPanel } from "@home-assistant-react/panel-lock/src";
import { MediaPlayerPanel } from "@home-assistant-react/panel-media-player/src";
import { MultiEntityPanel } from "@home-assistant-react/panel-multi-entity/src";
import { PersonPanel } from "@home-assistant-react/panel-person/src";
import { VacuumPanel } from "@home-assistant-react/panel-vacuum/src";
import { WastePanel } from "@home-assistant-react/panel-waste/src";
import { SensorPanel } from "@home-assistant-react/panel-sensor/src";
import { Toggle } from "@home-assistant-react/panel-toggle/src";
import { LightPanel } from "@home-assistant-react/panel-light/src";
import { Weather } from "@home-assistant-react/panel-weather/src";
import { SlideshowPanel } from "@home-assistant-react/panel-slideshow/src";

export const registerMainPanelComponents = () => {
  registerPanelComponent("Fallback", FallbackPanel);

  registerPanelComponent("Switch", LightPanel); //TODO rename to Light
  registerPanelComponent("Cover", CoverPanel);
  registerPanelComponent("Sensor", SensorPanel);
  registerPanelComponent("Toggle", Toggle);
  registerPanelComponent("Clock", Clock);
  registerPanelComponent("Stack", Stack);
  registerPanelComponent("Waste", WastePanel);
  registerPanelComponent("Weather", Weather);
  registerPanelComponent("Camera", CameraPanel);
  registerPanelComponent("Slideshow", SlideshowPanel);
  registerPanelComponent("Action", ActionPanel);
  registerPanelComponent("Climate", ClimatePanel);
  registerPanelComponent("MediaPlayer", MediaPlayerPanel);
  registerPanelComponent("Alarm", AlarmPanel);
  registerPanelComponent("Energy", EnergyPanel);
  registerPanelComponent("MultiEntity", MultiEntityPanel);
  registerPanelComponent("Person", PersonPanel);
  registerPanelComponent("Fan", FanPanel);
  registerPanelComponent("Lock", LockPanel);
  registerPanelComponent("Vacuum", VacuumPanel);
};
