import { render, screen } from "@testing-library/react";

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

import BottomSheetSalahTimesSettings from "../components/BottomSheets/BottomSheetSalahTimesSettings";
import userEvent from "@testing-library/user-event";

// const [userLocationCoords, setUserLocationCoords] = vi.fn()

// describe("location unit testing", () => {

// })

describe("location integration testing", () => {
  // let autoDetectBtn: HTMLButtonElement;

  beforeEach(async () => {
    render(<BottomSheetSalahTimesSettings triggerId="test-trigger" />);
    // autoDetectBtn = await screen.findByText("Auto-Detect");
  });

  it("triggers modal and renders relevant options", async () => {
    const selectLocationBtn = await screen.findByText(/select location/i);
    expect(selectLocationBtn).toBeInTheDocument();

    const selectCalcMethodBtn = await screen.findByText(
      /select calculation method/i
    );
    expect(selectCalcMethodBtn).toBeInTheDocument();

    const earlierAsrTimeText = await screen.findByText(/earlier asr time/i);
    expect(earlierAsrTimeText).toBeInTheDocument();

    const laterAsrTimeText = await screen.findByText(/later asr time/i);
    expect(laterAsrTimeText).toBeInTheDocument();
  });

  it("opens location settings and renders relevant options", async () => {
    const selectLocationBtn = await screen.findByText(/select location/i);
    expect(selectLocationBtn).toBeInTheDocument();
    await userEvent.click(selectLocationBtn);

    const findMyLocationText = await screen.findByText(/find my location/i);
    expect(findMyLocationText).toBeInTheDocument();

    const locationInput = await screen.findByPlaceholderText(/location/i);
    expect(locationInput).toBeInTheDocument();
  });

  // const autoDetectBtn = await screen.findByText(/gps/i);
  // expect(autoDetectBtn).toBeInTheDocument();

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
});
