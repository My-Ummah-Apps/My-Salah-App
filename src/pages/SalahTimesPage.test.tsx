import { render, screen } from "@testing-library/react";
import SalahTimesPage from "./SalahTimesPage";

import userEvent from "@testing-library/user-event";
import { act } from "react";
import {
  mockdbConnection,
  mockSetUserLocations,
  mockUserLocations,
  mockUserPrefs,
  mockUserPrefsState,
} from "../__mocks__/test-utils";

describe("Integration tests for Salah times page when no locations exist", () => {
  let setUpBtn: HTMLButtonElement;
  beforeEach(() => {
    render(
      <SalahTimesPage
        dbConnection={mockdbConnection}
        setUserPreferences={mockUserPrefsState}
        userPreferences={mockUserPrefs}
        setUserLocations={mockSetUserLocations}
        userLocations={[]}
      />
    );
    setUpBtn = screen.getByText(/set up salah times/i);
  });

  it("shows fallback if no locations exist", () => {
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
      const selectLocationBtn = await screen.findByText(/add location/i);
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

      const selectLocationBtn = await screen.findByText(/add location/i);
      expect(selectLocationBtn).toBeInTheDocument();
      await userEvent.click(selectLocationBtn);

      const findMyLocationText = await screen.findByText(/use device gps/i);
      expect(findMyLocationText).toBeInTheDocument();

      const locationInput = await screen.findByText(/enter location manually/i);
      expect(locationInput).toBeInTheDocument();

      // const latitudeInput = await screen.findByLabelText(/latitude/i);
      // expect(latitudeInput).toBeInTheDocument();

      // const longitudeInput = await screen.findByLabelText(/longitude/i);
      // expect(longitudeInput).toBeInTheDocument();
    });
  });
});

describe("ingeration tests for when atleast one location exists", () => {
  beforeEach(() => {
    render(
      <SalahTimesPage
        dbConnection={mockdbConnection}
        setUserPreferences={mockUserPrefsState}
        userPreferences={mockUserPrefs}
        setUserLocations={mockSetUserLocations}
        userLocations={mockUserLocations}
      />
    );
  });

  it("displays location which has isSelected property set to 1", () => {
    const locationName = screen.getByText(/doha/i);
    expect(locationName).toBeInTheDocument();
  });

  it("triggers bottom sheet showing locations list", () => {
    const chevron = screen.getByLabelText(/show all locations/i);
    expect(chevron).toBeInTheDocument();
  });
});
