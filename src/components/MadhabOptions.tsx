import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { userPreferencesType } from "../types/types";
import { updateUserPrefs } from "../utils/helpers";
import { IonRadio, IonRadioGroup, isPlatform } from "@ionic/react";

interface MadhabOptionsProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
  // onboardingMode?: boolean;
  // switchToNextPage?: () => void;
}

const MadhabOptions = ({
  dbConnection,
  setUserPreferences,
  userPreferences,
  // onboardingMode,
  // switchToNextPage,
}: MadhabOptionsProps) => {
  return (
    <IonRadioGroup value={userPreferences.madhab}>
      <section className="divide-y divide-[color:var(--sheet-divider-color)]">
        <div
          onClick={async () => {
            // if (switchToNextPage && onboardingMode) switchToNextPage();
            await updateUserPrefs(
              dbConnection,
              "madhab",
              "shafi",
              setUserPreferences,
            );
          }}
        >
          <IonRadio
            mode={isPlatform("ios") ? "ios" : "md"}
            value="shafi"
            labelPlacement="start"
            justify="space-between"
            className="pointer-events-none w-full py-3.5 text-base font-semibold leading-snug [--color:var(--secondary-text-color)] [&::part(label)]:whitespace-normal"
          >
            <span>
              Shafi'i, Maliki & Hanbali
              <span className="mt-1 block text-sm font-normal leading-snug text-[var(--secondary-text-color)]">
                Earlier Asr time
              </span>
            </span>
          </IonRadio>
        </div>
        <div
          onClick={async () => {
            // if (switchToNextPage && onboardingMode) switchToNextPage();
            await updateUserPrefs(
              dbConnection,
              "madhab",
              "hanafi",
              setUserPreferences,
            );
          }}
        >
          <IonRadio
            mode={isPlatform("ios") ? "ios" : "md"}
            value="hanafi"
            labelPlacement="start"
            justify="space-between"
            className="pointer-events-none w-full py-3.5 text-base font-semibold leading-snug [--color:var(--secondary-text-color)] [&::part(label)]:whitespace-normal"
          >
            <span>
              Hanafi
              <span className="mt-1 block text-sm font-normal leading-snug text-[var(--secondary-text-color)]">
                Later Asr time
              </span>
            </span>
          </IonRadio>
        </div>
      </section>
    </IonRadioGroup>
  );
};

export default MadhabOptions;
