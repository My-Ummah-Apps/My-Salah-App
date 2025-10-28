import { render, screen } from "@testing-library/react";
import SalahTimesPage from "./SalahTimesPage";
import { dictPreferencesDefaultValues } from "../utils/constants";
import userEvent from "@testing-library/user-event";
import { act } from "react";

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

  it("opens onboarding modal when setup button is clicked", async () => {
    const setUpBtn = screen.getByText(/Set Up Salah Times/i);
    // userEvent.click(setUpBtn);
    await act(async () => {
      await userEvent.click(setUpBtn);
    });

    const selectLocationText = await screen.findByText(/Salah Times Settings/i);
    expect(selectLocationText).toBeInTheDocument();
  });

  it("shows location settings", async () => {
    const setUpBtn = screen.getByText(/Set Up Salah Times/i);
    // userEvent.click(setUpBtn);
    await act(async () => {
      await userEvent.click(setUpBtn);
    });

    const selectLocationText = await screen.findByText(/Select Manually/i);
    expect(selectLocationText).toBeInTheDocument();
    const autoDetectLocationBtn = await screen.findByText(/Auto-Detect/i);
    expect(autoDetectLocationBtn).toBeInTheDocument();
    const manualLocationBtn = await screen.findByText(/Select Manually/i);
    expect(manualLocationBtn).toBeInTheDocument();
  });

  it("shows calculation method settings", async () => {
    const setUpBtn = screen.getByText(/Set Up Salah Times/i);
    userEvent.click(setUpBtn);

    // const methodSelectionText = await screen.findByText(
    //   "Select a calculation method"
    // );
    // expect(methodSelectionText).toBeInTheDocument();
    const select = await screen.findByLabelText(/Calculation Method/i);
    expect(select).toBeInTheDocument();
  });

  //   it("times change when date is changed", () => {});
});
