import { vi } from "vitest";
import { describe, it } from "node:test";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SalahTable from "./SalahTable";

describe("SalahTable integration test", () => {
  it("allows user to select a single Salah and update status, reasons and notes via bottom sheet", async () => {
    const user = userEvent.setup();

    render(
      <SalahTable
        dbConnection={{ current: undefined }}
        checkAndOpenOrCloseDBConnection={vi.fn()}
        modifyDataInUserPreferencesTable={vi.fn()}
        setShowJoyRideEditIcon={vi.fn()}
        showJoyRideEditIcon={false}
        userPreferences={userPreferences}
        setFetchedSalahData={setFetchedSalahData}
        fetchedSalahData={fetchedSalahData}
        setSelectedSalahAndDate={setSelectedSalahAndDate}
        selectedSalahAndDate={selectedSalahAndDate}
        setIsMultiEditMode={setIsMultiEditMode}
        isMultiEditMode={isMultiEditMode}
        setShowUpdateStatusModal={setShowUpdateStatusModal}
        showUpdateStatusModal={showUpdateStatusModal}
        generateStreaks={generateStreaks}
      />
    );
  });
});
