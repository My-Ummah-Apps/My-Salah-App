import { render, screen } from "@testing-library/react";
import BottomSheetSalahTimesSettings from "../BottomSheets/BottomSheetSalahTimesSettings";
import userEvent from "@testing-library/user-event";

import { vi } from "vitest";

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
    checkPermissions: vi.fn().mockResolvedValue({ location: "granted" }),
    requestPermissions: vi.fn().mockResolvedValue({ location: "granted" }),
  },
}));

import { Geolocation } from "@capacitor/geolocation";

// const [userLocationCoords, setUserLocationCoords] = vi.fn()

// describe("location unit testing", () => {

// })

describe("location integration testing", () => {
  // let autoDetectBtn: HTMLButtonElement;

  beforeEach(async () => {
    render(<BottomSheetSalahTimesSettings triggerId="test-trigger" />);
    // autoDetectBtn = await screen.findByText("Auto-Detect");
  });

  it("triggers location detection", async () => {
    const autoDetectBtn = await screen.findByText("Auto-Detect");
    expect(autoDetectBtn).toBeInTheDocument();
    await userEvent.click(autoDetectBtn);
    await expect(Geolocation.checkPermissions()).resolves.toEqual({
      location: "granted",
    });
    expect(Geolocation.getCurrentPosition).toHaveBeenCalled();

    // Now ensure state and DB are updated
    // UI should be updated with coords
    // DB update function should be called
  });

  // Denied? Display alert to user
  // Prompt? Await user choice
  // Granted? Proceed with capturing coords
  // coords would be captured
  // state would be updated
  // db would be updated via update db function

  it("handles location failure", () => {});
});
