import { render, screen } from "@testing-library/react";
import SalahTimesPage from "./SalahTimesPage";
import { dictPreferencesDefaultValues } from "../utils/constants";
import userEvent from "@testing-library/user-event";

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

    const setUpBtn = screen.getByText(/Set up Salah Times/i);
    expect(setUpBtn).toBeInTheDocument();
  });

  it("opens onboarding modal when setup button is clicked", () => {
    const setUpBtn = screen.getByText(/Set Up Salah Times/i);
    userEvent.click(setUpBtn);
    const selectLocationText = screen.getByText(/Select Location/i);
    expect(selectLocationText).toBeInTheDocument();
    const autoDetectLocationBtn = screen.getByText(/Auto-Detect/i);
    expect(autoDetectLocationBtn).toBeInTheDocument();
    const manualLocationBtn = screen.getByText(/Add Manually/i);
    expect(manualLocationBtn).toBeInTheDocument();
  });

  //   it("calculates times for location correctly", () => {});

  //   it("times change when date is changed", () => {});
});
