import { render, screen } from "@testing-library/react";
import SalahTimesPage from "./SalahTimesPage";
import { dictPreferencesDefaultValues } from "../utils/constants";
import userEvent from "@testing-library/user-event";
import { act } from "react";

const mockUserPrefs = {
  ...dictPreferencesDefaultValues,
  location: "",
};

describe("Integration tests for Salah times page", () => {
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
    await act(async () => {
      await userEvent.click(setUpBtn);
    });

    const selectLocationText = await screen.findByText("Salah Times Settings");
    expect(selectLocationText).toBeInTheDocument();
  });

  describe("it opens the salah times settings sheet and renders relevant options", () => {
    it("renders relevant options in the main salah times settings bottom sheet", async () => {
      await act(async () => {
        await userEvent.click(setUpBtn);
      });
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

    it("opens location settings bottom sheet and renders relevant options", async () => {
      await act(async () => {
        await userEvent.click(setUpBtn);
      });

      const selectLocationBtn = await screen.findByText(/select location/i);
      expect(selectLocationBtn).toBeInTheDocument();
      await userEvent.click(selectLocationBtn);

      const findMyLocationText = await screen.findByText(/find my location/i);
      expect(findMyLocationText).toBeInTheDocument();

      const locationInput = await screen.findByLabelText(/location/i);
      expect(locationInput).toBeInTheDocument();

      const latitudeInput = await screen.findByLabelText(/latitude/i);
      expect(latitudeInput).toBeInTheDocument();

      const longitudeInput = await screen.findByLabelText(/longitude/i);
      expect(longitudeInput).toBeInTheDocument();
    });
  });
});
