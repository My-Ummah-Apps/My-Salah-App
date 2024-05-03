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

// [tableRowDate]: { status: salahStatus, reasons: [], notes: "" }

export type currentStartDateType = number;
