// const autoDetectBtn = await screen.findByText(/gps/i);
// expect(autoDetectBtn).toBeInTheDocument();

import { render, screen } from "@testing-library/react";
import BottomSheetLocationSettings from "./BottomSheetLocationSettings";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

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

vi.mock("capacitor-native-settings", () => ({
  NativeSettings: {
    openIOS: vi.fn(),
    openAndroid: vi.fn(),
  },
}));

import {
  AndroidSettings,
  IOSSettings,
  NativeSettings,
} from "capacitor-native-settings";

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

import { Capacitor } from "@capacitor/core";

describe("Unit tests for GPS location button when permission is prompt", () => {
  let findMyLocationBtn: HTMLButtonElement;
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
    expect(Geolocation.requestPermissions).toHaveBeenCalled();
    expect(NativeSettings.openAndroid).not.toHaveBeenCalled();
    expect(NativeSettings.openIOS).not.toHaveBeenCalled();
  });
});

// describe("Unit tests for GPS location button functionality when location permission is granted", () => {
//   expect(Geolocation.getCurrentPosition).toHaveBeenCalled();
//     expect(Geolocation.getCurrentPosition).toEqual({
//       coords: { latitude: 53.48, longitude: -3.44 },
//     });
// });

describe("Unit tests for GPS location button functionality when location permission is denied", () => {
  let findMyLocationBtn: HTMLButtonElement;
  beforeEach(() => {
    vi.clearAllMocks();
    render(<BottomSheetLocationSettings triggerId={"testId"} />);
    findMyLocationBtn = screen.getByText(/find my location/i);

    vi.mocked(Geolocation.checkPermissions).mockResolvedValue({
      location: "denied",
      coarseLocation: "denied",
    });
  });

  it("opens iOS app settings when permission is denied", async () => {
    Capacitor.getPlatform = vi.fn(() => "ios");

    await userEvent.click(findMyLocationBtn);

    expect(NativeSettings.openIOS).toHaveBeenCalledWith({
      option: IOSSettings.App,
    });
  });

  it("opens Android app settings when permission is denied", async () => {
    Capacitor.getPlatform = vi.fn(() => "android");

    await userEvent.click(findMyLocationBtn);

    expect(NativeSettings.openAndroid).toHaveBeenCalledWith({
      option: AndroidSettings.Location,
    });
  });
});
