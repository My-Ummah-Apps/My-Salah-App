import { render, screen } from "@testing-library/react";
import BottomSheetSalahTimesSettings from "./BottomSheetSalahTimesSettings";
import userEvent from "@testing-library/user-event";

import { vi } from "vitest";
import * as ionic from "@ionic/react";

vi.mock("@ionic/react", async () => {
  const original: any = await vi.importActual("@ionic/react");
  return {
    ...original,
    IonModal: ({ children }: any) => <div>{children}</div>,
  };
});

describe("location testing", () => {
  beforeEach(() => {
    render(<BottomSheetSalahTimesSettings triggerId="test-trigger" />);
  });

  it("triggers location detection", async () => {
    const autoDetectBtn = await screen.findByText("Auto-Detect");
    expect(autoDetectBtn).toBeInTheDocument();
    userEvent.click(autoDetectBtn);
  });
});
