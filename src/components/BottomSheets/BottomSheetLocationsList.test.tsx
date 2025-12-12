import { render, screen } from "@testing-library/react";
import BottomSheetLocationsList from "./BottomSheetLocationsList";
import {
  mockdbConnection,
  mockUserLocations,
} from "../../__mocks__/test-utils";
import { vi } from "vitest";

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

describe("test ensuring fab button works", () => {
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

  it("opens add location sheet", async () => {
    const fabBtn = await screen.findByLabelText(/add location/i);
    expect(fabBtn).toBeInTheDocument();
  });

  // const fabBtn = container.querySelector('[data-testid="add-location-btn"]');
  // expect(fabBtn).toBeTruthy();
});
