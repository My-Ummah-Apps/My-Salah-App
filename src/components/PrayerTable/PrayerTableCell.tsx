import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { LuDot } from "react-icons/lu";

const PrayerTableCell = ({
  salahStatus,
  handleTableCellClick,
  setShowUpdateStatusModal,
  setHasUserClickedDate,
  doesSalahAndDateExists,
  formattedDate,
  salahName,
}: {
  salahStatus: string;
  handleTableCellClick: (salahName: string, formattedDate: string) => void;
  setShowUpdateStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHasUserClickedDate: React.Dispatch<React.SetStateAction<boolean>>;
  doesSalahAndDateExists: (
    salahName: string,
    formattedDate: string
  ) => Promise<string | null>;
  formattedDate: string;
  salahName: string;
}) => {
  let [cellData, setCellData] = useState<JSX.Element>(
    <LuDot className="w-[24px] h-[24px]" />
  );
  const iconStyles = "inline-block rounded-md text-white w-[24px] h-[24px]";
  //   const [salahStatus, setSalahStatus] = useState<null | string>();
  //
  console.log("TABLE CELL HAS RUN");
  useEffect(() => {
    async function fetchCellData() {
      //   const salahStatusResult = await doesSalahAndDateExists(
      //     salahName,
      //     formattedDate
      //   ); // This does cause database errors upon prayer table being scrolled
      let salahStatusResult = "male-alone"; // This does not cause database errors upon prayer table being scrolled
      //   setSalahStatus(salahStatusResult);
      //   console.log("SALAH STATUS IS:" + salahStatusResult);
      console.log("SALAH STATUS IS:" + salahStatusResult);

      if (salahStatusResult === "male-alone") {
        setCellData(
          <div
            className={`${iconStyles} bg-[color:var(--alone-male-status-color)]`}
          ></div>
        );
      } else if (salahStatusResult === "group") {
        setCellData(
          <div
            className={`${iconStyles} bg-[color:var(--jamaah-status-color)] `}
          ></div>
        );
      } else if (salahStatusResult === "female-alone") {
        setCellData(
          <div
            className={`${iconStyles} bg-[color:var(--alone-female-status-color)] `}
          ></div>
        );
      } else if (salahStatusResult === "excused") {
        setCellData(
          <div
            className={`${iconStyles} bg-[color:var(--excused-status-color)] `}
          ></div>
        );
      } else if (salahStatusResult === "late") {
        setCellData(
          <div
            className={`${iconStyles} bg-[color:var(--late-status-color)]  `}
          ></div>
        );
      } else if (salahStatusResult === "missed") {
        setCellData(
          <div
            className={`${iconStyles} bg-[color:var(--missed-status-color)] red-block  `}
          ></div>
        );
      }

      //   setCellData(<div>{salahStatusResult}</div>);
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
      onClick={() => {
        handleTableCellClick(salahName, formattedDate);
        setShowUpdateStatusModal(true);
        setHasUserClickedDate(true);
      }}
    >
      {cellData}
    </div>
  );
};

export default PrayerTableCell;
