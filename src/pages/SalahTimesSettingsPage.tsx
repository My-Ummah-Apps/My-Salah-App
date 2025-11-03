import { IonButton, IonContent } from "@ionic/react";
import { MdOutlineChevronRight } from "react-icons/md";
import LocationSettingsPage from "./LocationSettingsPage";

interface SalahTimesSettingsPageProps {
  nav: HTMLIonNavElement;
  madhab: string | null;
  setMadhab: React.Dispatch<React.SetStateAction<"earlier" | "later">>;
}

const SalahTimesSettingsPage = ({
  nav,
  setMadhab,
  madhab,
}: SalahTimesSettingsPageProps) => {
  const navigateToLocationSettingsPage = () =>
    nav.push(LocationSettingsPage, { nav });

  console.log(madhab);

  return <></>;
};

export default SalahTimesSettingsPage;
