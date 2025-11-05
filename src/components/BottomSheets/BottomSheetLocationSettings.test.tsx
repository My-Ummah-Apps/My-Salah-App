// const autoDetectBtn = await screen.findByText(/gps/i);
// expect(autoDetectBtn).toBeInTheDocument();

import { render, screen, waitFor } from "@testing-library/react";
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
    open: vi.fn(),
  },
}));

import { NativeSettings } from "capacitor-native-settings";

vi.mock("@capacitor/geolocation", () => ({
  Geolocation: {
    getCurrentPosition: vi.fn().mockResolvedValue({
      coords: { latitude: 53.48, longitude: -3.44 },
    }),
    checkPermissions: vi.fn().mockResolvedValue({
      location: "granted",
      coarseLocation: "granted",
    }),
    requestPermissions: vi.fn().mockResolvedValue({
      location: "granted",
      coarseLocation: "granted",
    }),
  },
}));

import { Geolocation } from "@capacitor/geolocation";

describe("Unit tests for GPS location button functionality", () => {
  let findMyLocationBtn: HTMLButtonElement;
  beforeEach(() => {
    render(<BottomSheetLocationSettings triggerId={"testId"} />);
    findMyLocationBtn = screen.getByText(/find my location/i);
  });

  it("triggers native settings alert when user taps on find my location button but permission has been denied", async () => {
    vi.mocked(Geolocation.checkPermissions).mockResolvedValueOnce({
      location: "denied",
      coarseLocation: "denied",
    });
    await userEvent.click(findMyLocationBtn);

    await waitFor(() => {
      expect(NativeSettings.open).toHaveBeenCalled();
    });
    expect(
      screen.findByText(/please turn on location permissions/i)
    ).toBeInTheDocument();
  });
});
