import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { LuDot } from "react-icons/lu";

const PrayerTableCell = ({
  cellDate,
  salahStatus,
  //   handleTableCellClick,
  setShowUpdateStatusModal,
  setHasUserClickedDate,
  doesSalahAndDateExists,
  //   formattedDate,
  salahName,
}: {
  cellDate: string;
  salahStatus: string;
  //   handleTableCellClick: (salahName: string, formattedDate: string) => void;
  setShowUpdateStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHasUserClickedDate: React.Dispatch<React.SetStateAction<boolean>>;
  //   doesSalahAndDateExists: (
  //     salahName: string,
  //     formattedDate: string
  //   ) => Promise<string | null>;
  doesSalahAndDateExists: (salahName: string, formattedDate: string) => void;
  //   formattedDate: string;
  salahName: string;
}) => {
  //   console.log("CELL DATE IS: ");
  //   console.log(cellDate);
  //   console.log("salahName IS:");
  //   console.log(salahName);
  //   console.log("salahStatus IS:");
  //   console.log(salahStatus);
  let [cellData, setCellData] = useState<JSX.Element>(
    <LuDot className="w-[24px] h-[24px]" />
  );
  const iconStyles = "inline-block rounded-md text-white w-[24px] h-[24px]";
  //   const [salahStatus, setSalahStatus] = useState<null | string>();
  //
  //   console.log("TABLE CELL HAS RUN AND ITS DATE ROW DATE IS: " + formattedDate);

  useEffect(() => {
    async function fetchCellData() {
      //   let salahStatus = "male-alone"; // This does not cause database errors upon prayer table being scrolled
      //   setSalahStatus(salahStatus);
      //   console.log("SALAH STATUS IS:" + salahStatus);

      if (salahStatus === "male-alone") {
        setCellData(
          <div
            className={`${iconStyles} bg-[color:var(--alone-male-status-color)]`}
          ></div>
        );
      } else if (salahStatus === "group") {
        setCellData(
          <div
            className={`${iconStyles} bg-[color:var(--jamaah-status-color)] `}
          ></div>
        );
      } else if (salahStatus === "female-alone") {
        setCellData(
          <div
            className={`${iconStyles} bg-[color:var(--alone-female-status-color)] `}
          ></div>
        );
      } else if (salahStatus === "excused") {
        setCellData(
          <div
            className={`${iconStyles} bg-[color:var(--excused-status-color)] `}
          ></div>
        );
      } else if (salahStatus === "late") {
        setCellData(
          <div
            className={`${iconStyles} bg-[color:var(--late-status-color)]  `}
          ></div>
        );
      } else if (salahStatus === "missed") {
        setCellData(
          <div
            className={`${iconStyles} bg-[color:var(--missed-status-color)] red-block  `}
          ></div>
        );
      } else {
        setCellData(<LuDot className="w-[24px] h-[24px]" />);
      }
    }

    fetchCellData();
  }, []);
  //   console.log("CELL DATA IS: ");
  //   console.log(cellData);
  return (
    <div
      id="icon-wrap"
      className="flex items-center justify-center h-full pt-6 pb-5 text-center td-element"
      key={uuidv4()}
      onClick={async () => {
        // handleTableCellClick(salahName, formattedDate);
        await doesSalahAndDateExists(salahName, cellDate);
        setShowUpdateStatusModal(true);
        setHasUserClickedDate(true);
      }}
    >
      {cellData}
    </div>
  );
};

export default PrayerTableCell;
