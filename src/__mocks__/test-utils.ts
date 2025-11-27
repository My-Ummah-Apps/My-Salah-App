import { vi } from "vitest";
import { dictPreferencesDefaultValues } from "../utils/constants";
import { SQLiteDBConnection } from "@capacitor-community/sqlite";

export const mockUserPrefsState = vi.fn();
export const mockUserPrefs = {
  ...dictPreferencesDefaultValues,
};
export const mockdbConnection = {
  current: {
    run: vi.fn().mockResolvedValue(undefined),
    query: vi.fn().mockResolvedValue({ values: [] }),
  },
} as unknown as React.MutableRefObject<SQLiteDBConnection | undefined>;

export const mockSetUserLocations = vi.fn();
