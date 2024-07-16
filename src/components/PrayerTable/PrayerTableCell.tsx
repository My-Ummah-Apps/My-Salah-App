import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { LuDot } from "react-icons/lu";
import PrayerStatusBottomSheet from "./PrayerStatusBottomSheet";

const PrayerTableCell = ({
  dbConnection,
  salahName,
  salahStatusFromCell,
  cellDate,
  userGender,
}: {
  salahName: string;
  salahStatusFromCell: string;
  cellDate: string;
  dbConnection: any;
  userGender: string;
}) => {
  //   console.log("CELL DATE IS: ");
  //   console.log(cellDate);
  //   console.log("salahName IS:");
  //   console.log(salahName);
  //   console.log("salahStatus IS:");
  //   console.log(salahStatus);

  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [hasUserClickedDate, setHasUserClickedDate] = useState<boolean>(false);

  let [cellData, setCellData] = useState<JSX.Element>(
    <LuDot className="w-[24px] h-[24px]" />
  );
  const iconStyles = "inline-block rounded-md text-white w-[24px] h-[24px]";
  //   const [salahStatus, setSalahStatus] = useState<null | string>();
  //
  // console.log("TABLE CELL HAS RUN AND ITS DATE ROW DATE IS: " + cellDate);
  // console.log("TABLE CELL HAS RUN AND ITS SALAH IS: " + salahName);

  const dict = {
    group: "bg-[color:var(--jamaah-status-color)]",
    "male-alone": "bg-[color:var(--alone-male-status-color)]",
    "female-alone": "bg-[color:var(--alone-female-status-color)]",
    excused: "bg-[color:var(--excused-status-color)]",
    late: "bg-[color:var(--late-status-color)]",
    missed: "bg-[color:var(--missed-status-color)]",
  };

  console.log(salahStatusFromCell);

  useEffect(() => {
    async function fetchCellData() {
      if (salahStatusFromCell === "") {
        setCellData(<LuDot className="w-[24px] h-[24px]" />);
      } else {
        setCellData(
          <div className={`${iconStyles} ${dict[salahStatusFromCell]} `}></div>
        );
      }
    }

    fetchCellData();
  }, []);
  //   console.log("CELL DATA IS: ");
  //   console.log(cellData);
  return (
    <>
      <div
        id="icon-wrap"
        className="flex items-center justify-center h-full pt-6 pb-5 text-center td-element"
        key={uuidv4()}
        onClick={async () => {
          // handleTableCellClick(salahName, date);
          setShowUpdateStatusModal(true);
          setHasUserClickedDate(true);
        }}
      >
        {cellData}
      </div>
      {showUpdateStatusModal && (
        <PrayerStatusBottomSheet
          salahName={salahName}
          cellDate={cellDate}
          dbConnection={dbConnection}
          userGender={userGender}
          setShowUpdateStatusModal={setShowUpdateStatusModal}
          showUpdateStatusModal={showUpdateStatusModal}
          setHasUserClickedDate={setHasUserClickedDate}
          hasUserClickedDate={hasUserClickedDate}
        />
      )}
    </>
  );
};

export default PrayerTableCell;
