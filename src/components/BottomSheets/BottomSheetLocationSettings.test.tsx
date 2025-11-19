// const autoDetectBtn = await screen.findByText(/gps/i);
// expect(autoDetectBtn).toBeInTheDocument();

import { render, screen } from "@testing-library/react";
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

import {
  mockdbConnection,
  mockUserPrefsState,
} from "../../__mocks__/test-utils";
import { Capacitor } from "@capacitor/core";

const getPlatformSpy = vi.spyOn(Capacitor, "getPlatform");

import BottomSheetLocationSettings from "./BottomSheetLocationSettings";

describe("Unit tests for GPS location button when permission is prompt", () => {
  let findMyLocationBtn: HTMLButtonElement;
  let promptSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(Geolocation.checkPermissions).mockResolvedValue({
      location: "prompt",
      coarseLocation: "prompt",
    });
    vi.mocked(Geolocation.requestPermissions).mockResolvedValue({
      location: "prompt",
      coarseLocation: "prompt",
    });
    getPlatformSpy.mockReturnValue("android");
    promptSpy = vi
      .spyOn(constantsFile, "promptToOpenDeviceSettings")
      .mockResolvedValue(undefined);

    render(
      <BottomSheetLocationSettings
        triggerId={"testId"}
        dbConnection={mockdbConnection}
        setUserPreferences={mockUserPrefsState}
      />
    );

    findMyLocationBtn = screen.getByText(/find my location/i);
  });

  it("asks user for permission", async () => {
    await userEvent.click(findMyLocationBtn);
    // expect(Geolocation.checkPermissions).toHaveBeenCalled();
    expect(Geolocation.requestPermissions).toHaveBeenCalled();
    expect(promptSpy).not.toHaveBeenCalled();
  });
});

describe("Unit tests for GPS location button functionality when location permission is granted", () => {
  let findMyLocationBtn: HTMLButtonElement;
  let promptSpy: ReturnType<typeof vi.spyOn>;

  // const updatePrefsSpy = vi.spyOn(constantsFile, "updateUserPrefs");

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(Geolocation.checkPermissions).mockResolvedValue({
      location: "granted",
      coarseLocation: "granted",
    });
    promptSpy = vi
      .spyOn(constantsFile, "promptToOpenDeviceSettings")
      .mockResolvedValue(undefined);

    render(
      <BottomSheetLocationSettings
        triggerId={"testId"}
        dbConnection={mockdbConnection}
        setUserPreferences={mockUserPrefsState}
      />
    );
    findMyLocationBtn = screen.getByText(/find my location/i);
  });

  it("retrieves location coordinates", async () => {
    await expect(Geolocation.getCurrentPosition()).resolves.toEqual({
      coords: { latitude: 53.48, longitude: -3.44 },
    });

    await userEvent.click(findMyLocationBtn);

    expect(Geolocation.checkPermissions).toHaveBeenCalled();
    expect(Geolocation.requestPermissions).not.toHaveBeenCalled();

    expect(Geolocation.getCurrentPosition).toHaveBeenCalled();

    // expect(updatePrefsSpy).toHaveBeenCalled();
    expect(promptSpy).not.toHaveBeenCalled();
  });

  it("shows alert for user to name location after coordinates are retrieved", async () => {
    vi.mocked(Geolocation.getCurrentPosition).mockResolvedValue({
      coords: { latitude: 53.48, longitude: -3.44 },
    } as GeolocationPosition);

    await userEvent.click(findMyLocationBtn);

    // ! assert that the spinner is visible
    const locationLoader = document.body.querySelector("ion-loading");
    expect(locationLoader).toBeInTheDocument();
    // ! assert here that the alert function is triggered via spyOn

    await screen.findByText(/enter location manually/i);
    // enter location name > hit save > assert that DB was updated by spying on DB updater function
  });
});

describe("Unit tests for GPS location button functionality when location permission is denied", () => {
  let findMyLocationBtn: HTMLButtonElement;
  let promptSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(Geolocation.checkPermissions).mockResolvedValue({
      location: "denied",
      coarseLocation: "denied",
    });

    promptSpy = vi
      .spyOn(constantsFile, "promptToOpenDeviceSettings")
      .mockResolvedValue(undefined);

    getPlatformSpy.mockReturnValue("android");

    render(
      <BottomSheetLocationSettings
        triggerId={"testId"}
        dbConnection={mockdbConnection}
        setUserPreferences={mockUserPrefsState}
      />
    );
    findMyLocationBtn = screen.getByText(/find my location/i);
  });

  it("shows user a prompt to open system settings on Android when location permissions are turned off in system settings", async () => {
    await userEvent.click(findMyLocationBtn);

    // expect(promptSpy).toHaveBeenCalledWith(
    //   expect.any(String),
    //   expect.anything()
    // );
    expect(promptSpy).toHaveBeenCalledTimes(1);
    expect(Geolocation.requestPermissions).not.toHaveBeenCalled();
    expect(Geolocation.getCurrentPosition).not.toHaveBeenCalled();
  });
});
