// const autoDetectBtn = await screen.findByText(/gps/i);
// expect(autoDetectBtn).toBeInTheDocument();

import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import * as constantsFile from "../../utils/constants";
import * as dbUtilsFile from "../../utils/dbUtils";
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
import { setupIonicReact } from "@ionic/react";

setupIonicReact({
  animated: false,
});

vi.mock("@ionic/react", async () => {
  const original: any = await vi.importActual("@ionic/react");
  return {
    ...original,
    IonModal: ({ children }: any) => <div>{children}</div>,
  };
});

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

import { mockdbConnection } from "../../__mocks__/test-utils";
import { Capacitor } from "@capacitor/core";

const getPlatformSpy = vi.spyOn(Capacitor, "getPlatform");

import BottomSheetLocationSettings from "./BottomSheetLocationSettings";

describe("tests for GPS location button when permission is prompt", () => {
  let findMyLocationBtn: HTMLButtonElement;
  let promptSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(Geolocation.checkPermissions).mockResolvedValue({
      location: "prompt",
      coarseLocation: "prompt",
    });

    getPlatformSpy.mockReturnValue("android");
    promptSpy = vi
      .spyOn(constantsFile, "promptToOpenDeviceSettings")
      .mockResolvedValue(undefined) as any;

    render(
      <BottomSheetLocationSettings
        triggerId={"testId"}
        dbConnection={mockdbConnection}
        setUserLocations={vi.fn()}
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

describe("tests for GPS location button functionality when location permission is granted", () => {
  let findMyLocationBtn: HTMLButtonElement;
  let promptSpy: ReturnType<typeof vi.spyOn>;
  let addUserLocationFunctionSpy: ReturnType<typeof vi.spyOn>;

  // const updatePrefsSpy = vi.spyOn(constantsFile, "updateUserPrefs");

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(Geolocation.checkPermissions).mockResolvedValue({
      location: "granted",
      coarseLocation: "granted",
    });
    promptSpy = vi
      .spyOn(constantsFile, "promptToOpenDeviceSettings")
      .mockResolvedValue(undefined) as any;

    addUserLocationFunctionSpy = vi
      .spyOn(dbUtilsFile, "addUserLocation")
      .mockResolvedValue(undefined) as any;

    render(
      <BottomSheetLocationSettings
        triggerId={"testId"}
        dbConnection={mockdbConnection}
        setUserLocations={vi.fn()}
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
    await userEvent.click(findMyLocationBtn);

    const locationLoader = document.body.querySelector("ion-loading");
    expect(locationLoader).toBeInTheDocument();

    const inputs = await screen.findAllByPlaceholderText(/e.g. home/i);
    expect(inputs[0]).toBeInTheDocument();
  });

  it("updates DB with new location when the input is not blank", async () => {
    await userEvent.click(findMyLocationBtn);

    const locationNameHeading = await screen.findByText(/enter location name/i);
    expect(locationNameHeading).toBeInTheDocument();

    const input = await screen.findByPlaceholderText(/e.g. home/i);
    expect(input).toBeInTheDocument();

    await userEvent.type(input, "Manchester", { delay: 5 });
    expect(input).toHaveValue("Manchester");
    const saveBtn = await screen.findByText(/save/i);
    await userEvent.click(saveBtn);

    const errorText = screen.queryByText(/please enter a location name/i);
    expect(errorText).not.toBeInTheDocument();

    await waitFor(() => {
      expect(addUserLocationFunctionSpy).toHaveBeenCalledTimes(1);
    });
  });

  it("does not update DB when input is blank and user presses save button", async () => {
    await userEvent.click(findMyLocationBtn);

    const input = await screen.findByPlaceholderText(/e.g. home/i);
    expect(input).toBeInTheDocument();

    await userEvent.clear(input);

    const saveBtn = await screen.findByText(/save/i);
    await userEvent.click(saveBtn);

    const errorText = await screen.findByText(/please enter a location name/i);
    expect(errorText).toBeVisible();
    await waitFor(() => {
      expect(addUserLocationFunctionSpy).not.toHaveBeenCalled();
    });
  });

  it("clears error message upon user saving a location", async () => {
    await userEvent.click(findMyLocationBtn);

    const input = await screen.findByPlaceholderText(/e.g. home/i);
    expect(input).toBeInTheDocument();

    await userEvent.clear(input);

    const saveBtn = await screen.findByText(/save/i);
    await userEvent.click(saveBtn);
    const errorText = await screen.findByText(/please enter a location name/i);
    expect(errorText).toBeVisible();

    await userEvent.type(input, "Manchester", { delay: 5 });
    expect(input).toHaveValue("Manchester");
    await userEvent.click(saveBtn);

    await userEvent.click(findMyLocationBtn);
    const input2 = await screen.findByPlaceholderText(/e.g. home/i);
    expect(input2).toBeInTheDocument();
    expect(input2).toHaveValue("");
    const errorTextQuery = screen.queryByText(/please enter a location name/i);
    expect(errorTextQuery).toHaveClass("invisible");
  });

  it("clears error message upon user pressing cancel button", async () => {
    await userEvent.click(findMyLocationBtn);

    const input = await screen.findByPlaceholderText(/e.g. home/i);
    expect(input).toBeInTheDocument();

    await userEvent.clear(input);

    const saveBtn = await screen.findByText(/save/i);
    await userEvent.click(saveBtn);
    const errorText = await screen.findByText(/please enter a location name/i);
    expect(errorText).toBeVisible();

    await userEvent.type(input, "Manchester", { delay: 5 });
    expect(input).toHaveValue("Manchester");

    const cancelBtn = await screen.findByText(/cancel/i);
    await userEvent.click(cancelBtn);

    await userEvent.click(findMyLocationBtn);
    const input2 = await screen.findByPlaceholderText(/e.g. home/i);
    expect(input2).toBeInTheDocument();
    expect(input2).toHaveValue("");
    const errorTextQuery = screen.queryByText(/please enter a location name/i);
    expect(errorTextQuery).toHaveClass("invisible");
  });

  it("does not update DB when location name already exists", () => {});
});

// describe("test for handling location detection failure", () => {
//   let findMyLocationBtn: HTMLButtonElement;

//   beforeEach(() => {
//     vi.clearAllMocks();

//     getPlatformSpy.mockReturnValue("android");

//     vi.mocked(Geolocation.checkPermissions).mockResolvedValue({
//       location: "granted",
//       coarseLocation: "granted",
//     });

//     vi.mocked(Geolocation.getCurrentPosition).mockRejectedValue(
//       new Error("There was en error trying to obtain the location")
//     );

//     render(
//       <BottomSheetLocationSettings
//         triggerId={"testId"}
//         dbConnection={mockdbConnection}
//         setUserPreferences={mockUserPrefsState}
//       />
//     );
//     findMyLocationBtn = screen.getByText(/find my location/i);
//   });

//   it("shows error message when app is unable to retrieve coords after user has granted location permission", async () => {
//     await userEvent.click(findMyLocationBtn);
// ! Replace below with state call assertion instead of toast detection
//     const toast = await screen.findByTestId("location-fail-toast");
//     expect(toast).toBeInTheDocument();
//   });
// });

describe("tests for GPS location button functionality when location permission is denied", () => {
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
      .mockResolvedValue(undefined) as any;

    render(
      <BottomSheetLocationSettings
        triggerId={"testId"}
        dbConnection={mockdbConnection}
        setUserLocations={vi.fn()}
      />
    );
    findMyLocationBtn = screen.getByText(/find my location/i);
  });

  it("shows user a prompt to open system settings on Android when location permissions are turned off in system settings", async () => {
    getPlatformSpy.mockReturnValue("android");
    await userEvent.click(findMyLocationBtn);

    expect(promptSpy).toHaveBeenCalledWith(
      expect.any(String),
      AndroidSettings.Location
    );
    expect(promptSpy).toHaveBeenCalledTimes(1);
    expect(Geolocation.requestPermissions).not.toHaveBeenCalled();
    expect(Geolocation.getCurrentPosition).not.toHaveBeenCalled();
  });

  it("shows user a prompt to open system settings on iOS when location permissions are turned off in system settings", async () => {
    getPlatformSpy.mockReturnValue("ios");
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
