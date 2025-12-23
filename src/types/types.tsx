export interface userPreferencesType {
  userStartDate: string;
  userGender: string;
  dailyNotification: string;
  dailyNotificationTime: string;
  reasons: string[];
  showReasons: string;
  showMissedSalahCount: string;
  isExistingUser: string;
  isMissedSalahToolTipShown: string;
  appLaunchCount: string;
  saveButtonTapCount: string;
  haptics: string;
  theme: "dark" | "light" | "system";
  prayerCalculationMethod:
    | "MuslimWorldLeague"
    | "Egyptian"
    | "Karachi"
    | "UmmAlQura"
    | "Dubai"
    | "Qatar"
    | "Kuwait"
    | "MoonsightingCommittee"
    | "NorthAmerica"
    | "Singapore"
    | "Turkey"
    | "Tehran"
    | "Other";
  madhab: "Hanafi" | "shafiMalikiHanbali";
  timeFormat: "12hr" | "24hr";
}

export type PreferenceType = keyof userPreferencesType;

export type PreferenceObjType = {
  preferenceName: PreferenceType;
  preferenceValue: string;
};

type LocationsDataObjType = {
  id: number;
  locationName: string;
  latitude: number;
  longitude: number;
  isSelected: number;
};

export type LocationsDataObjTypeArr = LocationsDataObjType[];

export type themeType = "light" | "dark" | "system";

export type SalahStatusType =
  | "group"
  | "male-alone"
  | "female-alone"
  | "late"
  | "missed"
  | "excused"
  | "";

export interface SalahsType {
  Fajr: SalahStatusType;
  Dhuhr: SalahStatusType;
  Asar: SalahStatusType;
  Maghrib: SalahStatusType;
  Isha: SalahStatusType;
}

export interface SalahRecordType {
  date: string;
  salahs: SalahsType;
}

export type SalahRecordsArrayType = SalahRecordType[];

export type SalahDataType = {
  [date: string]: string[];
};

export type SalahNamesType = "Fajr" | "Dhuhr" | "Asar" | "Maghrib" | "Isha";

export interface SalahEntryType {
  salahName: SalahNamesType;
  salahStatus: SalahStatusType;
}

export type salahReasonsOverallNumbersType = {
  "male-alone": { [reason: string]: number };
  late: { [reason: string]: number };
  missed: { [reason: string]: number };
};

export type SalahByDateObjType = {
  [date: string]: SalahNamesType[];
};

export interface restructuredMissedSalahListProp {
  [date: string]: SalahNamesType;
}

export interface clickedDateDataObj {
  date: string;
  id: number | null;
  salahName: SalahNamesType;
  salahStatus: SalahStatusType;
  notes: string;
  reasons: string;
}

export type DBConnectionStateType = "open" | "close";

export type userGenderType = "male" | "female";

export type currentStartDateType = number;

export type DBResultDataObjType = {
  id: number;
  date: string;
  salahName: SalahNamesType;
  salahStatus: SalahStatusType;
  reasons: string;
  notes: string;
};

export type DBResultDataObjArrayType = DBResultDataObjType[];

export type reasonsToShowType =
  | ""
  | "male-alone"
  | "late"
  | "missed"
  | undefined;

export type streakDatesObjType = {
  startDate: Date;
  endDate: Date;
  days: number;
  isActive: boolean;
  excusedDays: number;
};
