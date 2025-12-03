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

export const mockUserLocations = [
  {
    id: 1,
    isSelected: 0,
    latitude: 54.9421056,
    locationName: "Manchester",
    longitude: -1.5204352,
  },
  {
    id: 2,
    isSelected: 1,
    latitude: 54.9421056,
    locationName: "Doha",
    longitude: -1.5204352,
  },
  {
    id: 3,
    isSelected: 0,
    latitude: 54.9421056,
    locationName: "New York",
    longitude: -1.5204352,
  },
  {
    id: 7,
    isSelected: 0,
    latitude: 54.9421056,
    locationName: "Istanbul",
    longitude: -1.5204352,
  },
];
