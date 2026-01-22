import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { userPreferencesType } from "../types/types";
import { updateUserPrefs } from "../utils/helpers";
import { checkmarkCircle } from "ionicons/icons";
import { IonIcon } from "@ionic/react";

interface MadhabOptionsProps {
  dbConnection: React.MutableRefObject<SQLiteDBConnection | undefined>;
  setUserPreferences: React.Dispatch<React.SetStateAction<userPreferencesType>>;
  userPreferences: userPreferencesType;
}

const MadhabOptions = ({
  dbConnection,
  setUserPreferences,
  userPreferences,
}: MadhabOptionsProps) => {
  return (
    <section className="mx-4">
      <div
        onClick={async () => {
          await updateUserPrefs(
            dbConnection,
            "madhab",
            "shafi",
            setUserPreferences,
          );
        }}
        className={`options-wrap ${
          userPreferences.madhab === "shafi"
            ? "border-blue-500"
            : "border-transparent"
        }`}
      >
        <div className="mr-2">
          <IonIcon
            color="primary"
            className={` ${
              userPreferences.madhab === "shafi" ? "opacity-100" : "opacity-0"
            }`}
            icon={checkmarkCircle}
          />
        </div>

        <div>
          <p className="mt-0">Shafi'i, Maliki & Hanbali</p>
          <p className="text-xs">Earlier Asr time</p>
        </div>
      </div>

      <div
        onClick={async () => {
          await updateUserPrefs(
            dbConnection,
            "madhab",
            "hanafi",
            setUserPreferences,
          );
        }}
        className={`options-wrap   ${
          userPreferences.madhab === "hanafi"
            ? "border-blue-500"
            : "border-transparent"
        }`}
      >
        <div className="mr-2">
          <IonIcon
            color="primary"
            className={` ${
              userPreferences.madhab === "hanafi" ? "opacity-100" : "opacity-0"
            }`}
            icon={checkmarkCircle}
          />{" "}
        </div>

        <div>
          <p className="mt-0">Hanafi</p>
          <p className="text-xs">Later Asr time</p>
        </div>
      </div>
    </section>
  );
};

export default MadhabOptions;
