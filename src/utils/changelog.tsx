export const LATEST_APP_VERSION = "2.4";

export const changeLogs = [
  {
    versionNum: LATEST_APP_VERSION,
    changes: [
      {
        heading: "Minor Bug Fixes",
        text: (
          <>
            <strong>Fixed</strong>: Addressed several minor bugs, including
            prayer status sheet not animating on the main page
          </>
        ),
      },
      {
        heading: "Various Improvements",
        text: (
          <>
            <strong>Improvements:</strong>: Adjusted calendar styling by
            removing unnecessary radials for a cleaner look, additional reasons
            added when selecting alone/late/missed options for a Salah.
          </>
        ),
      },
    ],
  },
  {
    versionNum: "2.3",
    changes: [
      {
        heading: "Import / Export Functionality",
        text: (
          <>
            <strong>Feature</strong>: Added import/export functionality for
            seamless data backup and restoration
          </>
        ),
      },
    ],
  },
  {
    versionNum: "2.2",
    changes: [
      {
        heading: "Notification Time Modification",
        text: (
          <>
            <strong>Fixed</strong>: Resolved an issue preventing users from
            modifying notification time settings.
          </>
        ),
      },
      {
        heading: "Prayer Tracker - Day Visibility",
        text: (
          <>
            <strong>Improvement</strong>: Added day labels below dates in the
            prayer tracker for better clarity.
          </>
        ),
      },
    ],
  },
];
