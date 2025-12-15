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

    const fabBtn = screen.getByTestId("add-location-btn");
    expect(fabBtn).toBeInTheDocument();

    await userEvent.click(fabBtn);

    // const useDeviceGpsOption = screen.findByText("Use Device GPS");
    const useDeviceGpsOption = await screen.findByRole("button", {
      name: /use device gps/i,
    });
    expect(useDeviceGpsOption).toBeInTheDocument();

    const searchManuallyOption = screen.findByText("Search Manually");
    expect(searchManuallyOption).toBeInTheDocument();

    const manualCoordsOption = screen.findByText("Enter Coordinates");
    expect(manualCoordsOption).toBeInTheDocument();
  });

  // const fabBtn = container.querySelector('[data-testid="add-location-btn"]');
  // expect(fabBtn).toBeTruthy();
});
