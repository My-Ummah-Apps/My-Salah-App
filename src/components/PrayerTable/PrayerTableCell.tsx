import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { LuDot } from "react-icons/lu";

const PrayerTableCell = ({
  salahStatus,
  grabDate,
  setShowUpdateStatusModal,
  setHasUserClickedDate,
  doesSalahAndDateExists,
  formattedDate,
  salahName,
  iconStyles,
}: {
  salahStatus: string;
  grabDate: (salahName: string, formattedDate: string) => void;
  setShowUpdateStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHasUserClickedDate: React.Dispatch<React.SetStateAction<boolean>>;
  doesSalahAndDateExists: (
    salahName: string,
    formattedDate: string
  ) => Promise<boolean>;
  formattedDate: string;
  salahName: string;
  iconStyles: any;
}) => {
  let [cellData, setCellData] = useState<JSX.Element>(
    <LuDot className="w-[24px] h-[24px]" />
  );
  console.log("SALAH STATUS WITHIN CELL IS:");
  console.log(salahStatus);
  useEffect(() => {
    async function fetchCellData() {
      let icon: string | JSX.Element = <LuDot className="w-[24px] h-[24px]" />;

      if (await doesSalahAndDateExists(salahName, formattedDate)) {
        icon = salahStatus;
      }

      if (salahStatus === "male-alone") {
        cellData = (
          <div
            className={`${iconStyles} bg-[color:var(--alone-male-status-color)]`}
          ></div>
        );
      } else if (salahStatus === "group") {
        cellData = (
          <div
            className={`${iconStyles} bg-[color:var(--jamaah-status-color)] `}
          ></div>
        );
      } else if (salahStatus === "female-alone") {
        cellData = (
          <div
            className={`${iconStyles} bg-[color:var(--alone-female-status-color)] `}
          ></div>
        );
      } else if (salahStatus === "excused") {
        cellData = (
          <div
            className={`${iconStyles} bg-[color:var(--excused-status-color)] `}
          ></div>
        );
      } else if (salahStatus === "late") {
        cellData = (
          <div
            className={`${iconStyles} bg-[color:var(--late-status-color)]  `}
          ></div>
        );
      } else if (salahStatus === "missed") {
        cellData = (
          <div
            className={`${iconStyles} bg-[color:var(--missed-status-color)] red-block  `}
          ></div>
        );
      }

      setCellData(<div>{salahStatus}</div>);
    }

    fetchCellData();
  }, [formattedDate]);
  console.log("CELL DATA IS: ");
  console.log(cellData);
  return (
    <div
      id="icon-wrap"
      className="flex items-center justify-center h-full pt-6 pb-5 text-center td-element"
      key={uuidv4()}
      onClick={() => {
        grabDate(salahName, formattedDate);
        setShowUpdateStatusModal(true);
        setHasUserClickedDate(true);
      }}
    >
      {salahStatus}
    </div>
  );
};

export default PrayerTableCell;
