// const autoDetectBtn = await screen.findByText(/gps/i);
// expect(autoDetectBtn).toBeInTheDocument();

import { render, screen } from "@testing-library/react";
import BottomSheetLocationSettings from "./BottomSheetLocationSettings";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import * as constantsFile from "../../utils/constants";
import { AndroidSettings } from "capacitor-native-settings";

// await userEvent.click(autoDetectBtn);
// await expect(Geolocation.checkPermissions()).resolves.toEqual({
//   location: "granted",
// });
// expect(Geolocation.getCurrentPosition).toHaveBeenCalled();

// Now ensure state and DB are updated
// UI should be updated with coords
// DB update function should be called

// Denied? Display alert to user
// Prompt? Await user choice
// Granted? Proceed with capturing coords
// coords would be captured
// state would be updated
// db would be updated via update db function

// it("handles location failure", () => {});

vi.mock("@ionic/react", async () => {
  const original: any = await vi.importActual("@ionic/react");
  return {
    ...original,
    IonModal: ({ children }: any) => <div>{children}</div>,
  };
});

// vi.mock("capacitor-native-settings", () => ({
//   NativeSettings: {
//     openIOS: vi.fn(),
//     openAndroid: vi.fn(),
//   },
// }));

vi.mock("@capacitor/geolocation", () => ({
  Geolocation: {
    getCurrentPosition: vi.fn().mockResolvedValue({
      coords: { latitude: 53.48, longitude: -3.44 },
    }),
    checkPermissions: vi.fn(),
    requestPermissions: vi.fn(),
  },
}));

import { Geolocation } from "@capacitor/geolocation";

describe("Unit tests for GPS location button when permission is prompt", () => {
  let findMyLocationBtn: HTMLButtonElement;
  const promptSpy = vi.spyOn(constantsFile, "promptToOpenDeviceSettings");

  beforeEach(() => {
    vi.clearAllMocks();
    render(<BottomSheetLocationSettings triggerId={"testId"} />);
    findMyLocationBtn = screen.getByText(/find my location/i);

    vi.mocked(Geolocation.checkPermissions).mockResolvedValue({
      location: "prompt",
      coarseLocation: "prompt",
    });
  });

  it("asks user for permission", async () => {
    await userEvent.click(findMyLocationBtn);
    expect(Geolocation.checkPermissions).toHaveBeenCalled();
    expect(Geolocation.requestPermissions).toHaveBeenCalled();
    expect(promptSpy).not.toHaveBeenCalled();
  });
});

describe("Unit tests for GPS location button functionality when location permission is granted", () => {
  let findMyLocationBtn: HTMLButtonElement;
  const promptSpy = vi.spyOn(constantsFile, "promptToOpenDeviceSettings");
  const updatePrefsSpy = vi.spyOn(constantsFile, "updateUserPreferences");

  beforeEach(() => {
    vi.clearAllMocks();
    render(<BottomSheetLocationSettings triggerId={"testId"} />);
    findMyLocationBtn = screen.getByText(/find my location/i);

    vi.mocked(Geolocation.checkPermissions).mockResolvedValue({
      location: "granted",
      coarseLocation: "granted",
    });
  });

  it("retrieves location coordinates", async () => {
    await userEvent.click(findMyLocationBtn);

    expect(Geolocation.checkPermissions).toHaveBeenCalled();
    expect(Geolocation.requestPermissions).not.toHaveBeenCalled();

    expect(Geolocation.getCurrentPosition).toHaveBeenCalled();

    await expect(Geolocation.getCurrentPosition()).resolves.toEqual({
      coords: { latitude: 53.48, longitude: -3.44 },
    });
    expect(promptSpy).not.toHaveBeenCalled();
  });
});

describe("Unit tests for GPS location button functionality when location permission is denied", () => {
  let findMyLocationBtn: HTMLButtonElement;
  const promptSpy = vi.spyOn(constantsFile, "promptToOpenDeviceSettings");
  beforeEach(() => {
    vi.clearAllMocks();
    render(<BottomSheetLocationSettings triggerId={"testId"} />);
    findMyLocationBtn = screen.getByText(/find my location/i);

    vi.mocked(Geolocation.checkPermissions).mockResolvedValue({
      location: "denied",
      coarseLocation: "denied",
    });
  });

  it("shows user a prompt to open system settings when location permissions are turned off in system settings", async () => {
    await userEvent.click(findMyLocationBtn);

    expect(promptSpy).toHaveBeenCalledWith(
      expect.any(String),
      AndroidSettings.Location
    );
    expect(promptSpy).toHaveBeenCalledTimes(1);
    expect(Geolocation.requestPermissions).not.toHaveBeenCalled();
    expect(Geolocation.getCurrentPosition).not.toHaveBeenCalled();
  });
});
