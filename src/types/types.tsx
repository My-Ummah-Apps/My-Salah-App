// export interface salahTrackingArrayType {
//   salahName: string;
//   completedDates: { [date: string]: string }[] | [];
// }

type SalahStatus =
  | "group"
  | "male-alone"
  | "female-alone"
  | "late"
  | "missed"
  | "excused";

interface Salahs {
  salahs: {
    Fajr: SalahStatus;
    Dhuhr: SalahStatus;
    Asar: SalahStatus;
    Maghrib: SalahStatus;
    Isha: SalahStatus;
  };
}

export interface SalahRecord {
  date: string;
  salah: Salahs;
}

export type SalahRecordsArray = SalahRecord[];

export type PreferenceType =
  | "userGender"
  | "dailyNotification"
  | "dailyNotificationTime"
  | "haptics"
  | "reasonsArray"
  | "showReasons";

type SalahNames = "Fajr" | "Dhuhr" | "Asar" | "Maghrib" | "Isha";

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
