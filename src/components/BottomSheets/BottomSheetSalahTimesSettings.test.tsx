import { render, screen } from "@testing-library/react";
import BottomSheetSalahTimesSettings from "./BottomSheetSalahTimesSettings";
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
  },
}));

import { Geolocation } from "@capacitor/geolocation";

describe("location testing", () => {
  beforeEach(() => {
    render(<BottomSheetSalahTimesSettings triggerId="test-trigger" />);
  });

  it("triggers location detection", async () => {
    const autoDetectBtn = await screen.findByText("Auto-Detect");
    expect(autoDetectBtn).toBeInTheDocument();
    await userEvent.click(autoDetectBtn);

    expect(Geolocation.getCurrentPosition).toHaveBeenCalled();
  });
});
