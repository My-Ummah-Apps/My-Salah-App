import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { LuDot } from "react-icons/lu";

const PrayerTableCell = ({
  //   salahStatus,
  grabDate,
  setShowUpdateStatusModal,
  setHasUserClickedDate,
  doesSalahAndDateExists,
  formattedDate,
  salahName,
  iconStyles,
}: {
  //   salahStatus: string;
  grabDate: (salahName: string, formattedDate: string) => void;
  setShowUpdateStatusModal: React.Dispatch<React.SetStateAction<boolean>>;
  setHasUserClickedDate: React.Dispatch<React.SetStateAction<boolean>>;
  doesSalahAndDateExists: (
    salahName: string,
    formattedDate: string
  ) => Promise<string>;
  formattedDate: string;
  salahName: string;
  iconStyles: any;
}) => {
  let [cellData, setCellData] = useState<JSX.Element>(
    <LuDot className="w-[24px] h-[24px]" />
  );

  useEffect(() => {
    console.log("USEEFFECT FOR CELL HAS RUN!");
    async function fetchCellData() {
      console.log("FETCH DATA HAS RUN");

      //   console.log("SALAH NAME IS: " + salahName);
      //   console.log("DATE IS: " + formattedDate);

      let icon: string | JSX.Element = <LuDot className="w-[24px] h-[24px]" />;
      //   This isn't equalling to true for some reasons
      //   if ((await doesSalahAndDateExists(salahName, formattedDate)) === true) {
      //     //   icon = salahStatus;
      //     //   console.log("SALAH STATUS WITHIN CELL IS:");
      //     // salahStatus = ""
      //   }
      const salahStatus = await doesSalahAndDateExists(
        salahName,
        formattedDate
      );
      console.log("SALAH STATUS IS:" + salahStatus);

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
      }

      //   setCellData(<div>{salahStatus}</div>);
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
        grabDate(salahName, formattedDate);
        setShowUpdateStatusModal(true);
        setHasUserClickedDate(true);
      }}
    >
      {cellData}
    </div>
  );
};

export default PrayerTableCell;
