// export interface salahTrackingArrayType {
//   salahName: string;
//   completedDates: { [date: string]: string }[] | [];
// }

export interface salahTrackingEntryType {
  salahName: string;
  completedDates: {
    [date: string]: { status: string; reasons: string[]; notes: string };
  }[];
}

export type PreferenceType =
  | "userGender"
  | "dailyNotification"
  | "dailyNotificationTime"
  | "haptics"
  | "reasonsArray"
  | "showReasons";

// [tableRowDate]: { status: salahStatus, reasons: [], notes: "" }

export type currentStartDateType = number;
