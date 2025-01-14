// 1. Increment LATEST_APP_VERSION 2.Change verisonNum of the first object in changeLogs to a string number (eg "3.0") 3. Add new object to changeLogs Array with its versionNum being the variable LATEST_APP_VERSION

export const LATEST_APP_VERSION = "3.0";

export const changeLogs = [
  {
    versionNum: LATEST_APP_VERSION,
    changes: [
      {
        heading: "Settings Page Enhancements",
        text: (
          <>
            <strong>Enhancement:</strong> Added review & share options in the
            Settings page, along with a website link.
          </>
        ),
      },
      {
        heading: "UI Improvements",
        text: (
          <>
            <strong>UI:</strong> Adjusted toggle colors on the settings page for
            notifications and missed Salah counter to ensure consistency.
          </>
        ),
      },
    ],
  },

  {
    versionNum: "2.9",
    changes: [
      {
        heading: "Privacy Policy Link",
        text: (
          <>
            <strong>Feature:</strong> Added a link to the privacy policy within
            the settings page.
          </>
        ),
      },
      {
        heading: "Enhanced Onboarding Process",
        text: (
          <>
            <strong>Feature:</strong> Improved onboarding process for new users,
            introduced new intro sheets that include an option to enable
            notifications.
          </>
        ),
      },
      {
        heading: "Tooltip for Missed Salah Counter",
        text: (
          <>
            <strong>UX:</strong> Added a tooltip to the missed Salah counter
            button to help users understand its functionality when it triggers
            for the first time.
          </>
        ),
      },
    ],
  },
  {
    versionNum: "2.8",
    changes: [
      {
        heading: "Missed Salah Feature",
        text: (
          <>
            <strong>Feature:</strong> Introduced a convenient feature allowing
            easy completion of missed Salah. If any Salah is missed, a
            notification will appear in the top-left corner of the home page.
            Tapping on it will display a list of all missed Salah, which can
            then be marked as completed individually, this feature can be turned
            off from the settings page.
          </>
        ),
      },
      {
        heading: "Status Sheet Data Display Issue Resolved",
        text: (
          <>
            <strong>Fixed:</strong> Fixed an issue where the status update sheet
            was displaying data for a previous Salah that was just edited.
          </>
        ),
      },
      {
        heading: "Minor UI Enhancements",
        text: (
          <>
            <strong>UI:</strong> Added a backdrop color to sheets for better
            visibility. Donut chart labels now only appear when relevant data is
            present.
          </>
        ),
      },
    ],
  },

  {
    versionNum: "2.7",
    changes: [
      {
        heading: "Multi-Edit Mode",
        text: (
          <>
            <strong>Feature:</strong> Activate Multi-Edit Mode by tapping the
            icon at the top-left of the table. This allows you to edit multiple
            Salah entries across different dates at once, provided they share
            the same status, reasons, and notes. Individual Salah editing
            remains available with a simple tap.
          </>
        ),
      },
    ],
  },
  {
    versionNum: "2.6",
    changes: [
      {
        heading: "Fixed Calendar Date Alignment",
        text: (
          <>
            <strong>Fixed:</strong> Resolved an issue where calendar dates were
            not correctly aligned with the weekday headers (Mon, Tue, Wed, etc).
            Dates now display under the correct day.
          </>
        ),
      },
    ],
  },
  {
    versionNum: "2.5",
    changes: [
      {
        heading: "Notification Fixes",
        text: (
          <>
            <strong>Fixed:</strong> Resolved multiple issues with notifications
            not working consistently. <br />
            <strong>Note:</strong> If notifications haven’t been working, please
            toggle them off and back on in settings to reactivate.
          </>
        ),
      },
      {
        heading: "Minor UI & UX Enhancements",
        text: (
          <>
            <strong>
              Improved:
              <br />
            </strong>{" "}
            - Enhanced styling for the single-date sheet in the calendar view
            <br />
            - Status and handlebar colors now match the app's background on
            Android for a more consistent look
            <br />- Changelog can now be viewed at any time from the settings
            page
          </>
        ),
      },
      {
        heading: "General Bug Fixes",
        text: (
          <>
            <strong>
              Fixed:
              <br />
            </strong>
            - Resolved an issue with the Android notification icon displaying an
            exclamation mark instead of the app icon. <br />
            - Fixed a permissions bug where blocking notifications in system
            settings wasn't properly reflected in the app settings. <br />
            - Updated notification permission checks on app reinstall to ensure
            accurate toggle behavior in settings. <br />
            - Fixed issues with the prayer table not rendering when app data or
            cache is cleared. <br />- Improved notes entry field in the status
            update sheet which now expands dynamically as the user types, with a
            max height for readability.
          </>
        ),
      },
    ],
  },
  {
    versionNum: "2.4",
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
