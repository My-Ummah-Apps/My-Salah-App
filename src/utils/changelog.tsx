export const LATEST_APP_VERSION = "2.2";

export const changeLogs = [
  {
    versionNum: LATEST_APP_VERSION,
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
