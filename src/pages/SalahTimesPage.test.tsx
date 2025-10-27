import { render, screen } from "@testing-library/react";
import SalahTimesPage from "./SalahTimesPage";

describe("Prayer Times", () => {
  render(<SalahTimesPage />);

  it("shows fallback if no location is selected", () => {
    const fallbackText = screen.getByText(/No location selected/);
    expect(fallbackText).toBeInTheDocument();

    const autoDetectBtn = screen.getByRole("button", {
      name: /Set up Salah Times/,
    });
    expect(autoDetectBtn).toBeInTheDocument();
  });

  //   it("calculates times for location correctly", () => {});

  //   it("times change when date is changed", () => {});
});
