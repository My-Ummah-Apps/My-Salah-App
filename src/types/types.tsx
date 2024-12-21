// export interface salahTrackingArrayType {
//   salahName: string;
//   completedDates: { [date: string]: string }[] | [];
// }

export interface userPreferencesType {
  userGender: userGenderType;
  userStartDate: string;
  dailyNotification: string;
  dailyNotificationTime: string;
  reasonsArray: string[];
  showMissedSalahCount: string;
}

export type PreferenceType =
  | "userStartDate"
  | "userGender"
  | "dailyNotification"
  | "dailyNotificationTime"
  | "haptics"
  | "reasons"
  | "showReasons"
  | "showMissedSalahCount"
  | "isExistingUser";

export type PreferenceObjType = {
  preferenceName: PreferenceType;
  preferenceValue: string;
};

export type SalahStatusType =
  | "group"
  | "male-alone"
  | "female-alone"
  | "late"
  | "missed"
  | "excused"
  | "";

interface SalahsType {
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

// export interface selectedSalahAndDateType {
//   [key: string]: SalahNamesType[];
// }

// interface SelectedSalahAndDateType {
//   [key: string]: string[];
// }

// export type SelectedSalahAndDateArrayType = SelectedSalahAndDateType[];

// !TODO: Below two types are duplicates, consolidate them into one
export type SelectedSalahAndDateObjType = {
  [date: string]: SalahNamesType[];
};

export type MissedSalahObjType = {
  [date: string]: SalahNamesType[];
};

export interface restructuredMissedSalahListProp {
  [date: string]: SalahNamesType;
}

// export interface CalenderSalahArrayObject {
//   [date: string]: SalahEntry[];
// }

// export type CalenderSalahArray = CalenderSalahArrayObject[];

export type DBConnectionStateType = "open" | "close";

export type userGenderType = "male" | "female";

// [tableRowDate]: { status: salahStatus, reasons: [], notes: "" }

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
