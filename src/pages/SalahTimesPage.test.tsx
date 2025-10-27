import { render, screen } from "@testing-library/react";
import SalahTimesPage from "./SalahTimesPage";
import { dictPreferencesDefaultValues } from "../utils/constants";

const mockUserPrefs = {
  ...dictPreferencesDefaultValues,
  location: "",
};

describe("Prayer Times", () => {
  beforeEach(() => {
    render(<SalahTimesPage userPreferences={mockUserPrefs} />);
  });

  it("shows fallback if no location is selected", () => {
    const fallbackText = screen.getByText(/Salah Times Not Set/i);
    expect(fallbackText).toBeInTheDocument();

    const autoDetectBtn = screen.getByText(/Set up Salah Times/i);
    expect(autoDetectBtn).toBeInTheDocument();
  });

  //   it("calculates times for location correctly", () => {});

  //   it("times change when date is changed", () => {});
});
