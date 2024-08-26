export const prayerStatusColorsHexCodes = {
  group: "#448b75",
  "male-alone": "#bcaa4b",
  "female-alone": "#448b75",
  excused: "#b317ae",
  late: "#ea580c",
  missed: "#b62e2e",
} as const;

export const prayerStatusColorsVars = {
  group: "bg-[color:var(--jamaah-status-color)]",
  "male-alone": "bg-[color:var(--alone-male-status-color)]",
  "female-alone": "bg-[color:var(--alone-female-status-color)]",
  excused: "bg-[color:var(--excused-status-color)]",
  late: "bg-[color:var(--late-status-color)]",
  missed: "bg-[color:var(--missed-status-color)]",
} as const;
