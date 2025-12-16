import { render, screen } from "@testing-library/react";
import BottomSheetLocationsList from "./BottomSheetLocationsList";
import {
  mockdbConnection,
  mockSetUserLocations,
  mockUserLocations,
  mockUserPrefs,
  mockUserPrefsState,
} from "../../__mocks__/test-utils";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import SalahTimesPage from "../../pages/SalahTimesPage";

describe.skip("tests ensuring all items are rendered", () => {
  beforeEach(() => {
    render(
      <BottomSheetLocationsList
        triggerId={"testId"}
        dbConnection={mockdbConnection}
        userLocations={mockUserLocations}
        setUserLocations={vi.fn()}
      />
    );
  });
});

//  <BottomSheetLocationsList
//         triggerId={"testId"}
//         dbConnection={mockdbConnection}
//         userLocations={mockUserLocations}
//         setUserLocations={vi.fn()}
//       />

describe("test ensuring fab button works", () => {
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

  it("opens add location sheet", async () => {
    const allLocationsSheetBtn = screen.getByLabelText("show all locations");
    await userEvent.click(allLocationsSheetBtn);

    // const fabBtn = await screen.findByTestId("add-location-btn");
    const fabBtn = await screen.findByLabelText("add location");
    expect(fabBtn).toBeInTheDocument();

    await userEvent.click(fabBtn);

    // const test = await screen.findByText(/to calculate/i);
    // expect(test).toBeInTheDocument();

    // const useDeviceGpsOption = await screen.findByText(/use device gps/i);
    // expect(useDeviceGpsOption).toBeInTheDocument();

    // const searchManuallyOption = await screen.findByText(/search manually/i);
    // expect(searchManuallyOption).toBeInTheDocument();

    // const manualCoordsOption = await screen.findByText(/enter coordinates/i);
    // expect(manualCoordsOption).toBeInTheDocument();
  });
});
