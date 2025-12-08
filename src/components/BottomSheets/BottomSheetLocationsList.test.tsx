import { render, screen } from "@testing-library/react";
import BottomSheetLocationsList from "./BottomSheetLocationsList";
import {
  mockdbConnection,
  mockUserLocations,
} from "../../__mocks__/test-utils";
import { vi } from "vitest";

describe.skip("tests for ensuring all items are rendered", () => {
  beforeEach(() => {
    render(
      <BottomSheetLocationsList
        triggerId={"testId"}
        dbConnection={mockdbConnection}
        userLocations={mockUserLocations}
        setUserLocations={vi.fn()}
      />
    );

    // findMyLocationBtn = screen.getByText(/Use Device GPS/i);
  });
});
