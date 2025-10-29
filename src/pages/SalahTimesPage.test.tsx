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
  let setUpBtn: HTMLButtonElement;
  beforeEach(() => {
    render(<SalahTimesPage userPreferences={mockUserPrefs} />);
    setUpBtn = screen.getByText("Set up Salah Times");
  });

  it("shows fallback if no location is selected", () => {
    const fallbackText = screen.getByText("Salah Times Not Set");
    expect(fallbackText).toBeInTheDocument();

    expect(setUpBtn).toBeInTheDocument();
  });

  it("opens onboarding modal when setup button is clicked", async () => {
    // userEvent.click(setUpBtn);
    await act(async () => {
      await userEvent.click(setUpBtn);
    });

    const selectLocationText = await screen.findByText("Salah Times Settings");
    expect(selectLocationText).toBeInTheDocument();
  });

  it("shows location settings", async () => {
    // userEvent.click(setUpBtn);
    await act(async () => {
      await userEvent.click(setUpBtn);
    });

    const selectLocationText = await screen.findByText("Select Manually");
    expect(selectLocationText).toBeInTheDocument();
    const autoDetectLocationBtn = await screen.findByText("Auto-Detect");
    expect(autoDetectLocationBtn).toBeInTheDocument();
    const manualLocationBtn = await screen.findByText("Select Manually");
    expect(manualLocationBtn).toBeInTheDocument();
  });

  it("shows calculation method settings", async () => {
    await act(async () => {
      await userEvent.click(setUpBtn);
    });

    const calculationMethodText = await screen.findByText("Calculation Method");
    expect(calculationMethodText).toBeInTheDocument();

    const methodSelectionLabel = await screen.findByPlaceholderText(
      "Select a calculation method"
    );
    expect(methodSelectionLabel).toBeInTheDocument();
  });

  it("shows school of thought settings", async () => {
    await act(async () => {
      await userEvent.click(setUpBtn);
    });

    const schoolOfThoughtText = await screen.findByText("Madhab / Asr Time");
    expect(schoolOfThoughtText).toBeInTheDocument();

    const schoolOfThoughtLabel = await screen.findByLabelText("Madhab");
    expect(schoolOfThoughtLabel).toBeInTheDocument();
  });
});
