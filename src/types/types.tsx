// export interface salahTrackingArrayType {
//   salahName: string;
//   completedDates: { [date: string]: string }[] | [];
// }

export interface userPreferences {
  userGender: userGenderType;
  userStartDate: string;
  dailyNotification: string;
  dailyNotificationTime: string;
  reasonsArray: string[];
}

export type SalahStatus =
  | "group"
  | "male-alone"
  | "female-alone"
  | "late"
  | "missed"
  | "excused"
  | "";

interface Salahs {
  Fajr: SalahStatus;
  Dhuhr: SalahStatus;
  Asar: SalahStatus;
  Maghrib: SalahStatus;
  Isha: SalahStatus;
}

export interface SalahRecord {
  date: string;
  salahs: Salahs;
}

export type SalahRecordsArray = SalahRecord[];

export type PreferenceType =
  | "userGender"
  | "dailyNotification"
  | "dailyNotificationTime"
  | "haptics"
  | "reasonsArray"
  | "showReasons";

export type SalahNames = "Fajr" | "Dhuhr" | "Asar" | "Maghrib" | "Isha";

export interface SalahEntry {
  salahName: SalahNames;
  salahStatus: SalahStatus;
}

export interface CalenderSalahArrayObject {
  [date: string]: SalahEntry[];
}

export type CalenderSalahArray = CalenderSalahArrayObject[];

export type DBConnectionStateType = "open" | "close";

export type userGenderType = "male" | "female";

// [tableRowDate]: { status: salahStatus, reasons: [], notes: "" }

export type currentStartDateType = number;

export type DBResultDataObj = {
  id: number;
  date: string;
  salahName: string;
  salahStatus: string;
  reasons: string;
  notes: string;
};

export type DBResultDataObjArray = DBResultDataObj[];
