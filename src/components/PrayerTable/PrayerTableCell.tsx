import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { LuDot } from "react-icons/lu";
import PrayerStatusBottomSheet from "./PrayerStatusBottomSheet";

const PrayerTableCell = ({
  dbConnection,
  salahName,
  cellDate,
  userGender,
}: {
  salahName: string;
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

  const [selectedSalah, setSelectedSalah] = useState("");
  const [salahStatus, setSalahStatus] = useState("");
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [showAddCustomReasonInputBox, setShowAddCustomReasonInputBox] =
    useState(false);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [reasonsArray, setReasonsArray] = useState<string[]>([]);
  let selectedReasonsArray = selectedReasons;
  const [hasUserClickedDate, setHasUserClickedDate] = useState<boolean>(false);
  const [customReason, setCustomReason] = useState("");
  const handleCustomReason = (e: any) => {
    setCustomReason(e.target.value);
  };
  const [notes, setNotes] = useState("");
  const handleNotes = (e: any) => {
    setNotes(e.target.value);
  };

  const doesSalahAndDateExists = async (salahName: string, date: string) => {
    try {
      const isDbOpen = await dbConnection.current?.isDBOpen();
      if (isDbOpen?.result === false) {
        await dbConnection.current?.open();
        console.log("DB CONNECTION OPENED IN doesSalahAndDateExists FUNCTION");
      }

      const query = `
      SELECT * FROM salahtrackingtable 
      WHERE salahName = ? AND date = ?;
    `;
      const values = [salahName, date];

      console.log(await dbConnection.current?.query(query, values));
      const res = await dbConnection.current?.query(query, values);

      console.log("res.values");
      console.log(res?.values);

      if (res && res.values && res.values.length > 0) {
        console.log("DATA FOUND");
        setSelectedSalah(salahName);
        setSalahStatus("group");
        setNotes("Data exists");
        return true;
      } else {
        setSalahStatus("");
        setNotes("No notes here");
        return false;
      }
    } catch (error) {
      console.log(
        "ERROR OPENING CONNECTION IN doesSalahAndDateExists FUNCTION:"
      );
      console.log(error);
    } finally {
      try {
        const isDbOpen = await dbConnection.current?.isDBOpen();
        if (isDbOpen?.result) {
          await dbConnection.current?.close();
          console.log("Database connection closed within addSalah function");
        }
      } catch (error) {
        console.log(
          "ERROR CLOSING DATABASE IN doesSalahAndDateExists FUNCTION:"
        );
        console.log(error);
      }
    }
  };

  let [cellData, setCellData] = useState<JSX.Element>(
    <LuDot className="w-[24px] h-[24px]" />
  );
  const iconStyles = "inline-block rounded-md text-white w-[24px] h-[24px]";
  //   const [salahStatus, setSalahStatus] = useState<null | string>();
  //
  console.log("TABLE CELL HAS RUN AND ITS DATE ROW DATE IS: " + cellDate);
  console.log("TABLE CELL HAS RUN AND ITS SALAH IS: " + salahName);

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
    <>
      <div
        id="icon-wrap"
        className="flex items-center justify-center h-full pt-6 pb-5 text-center td-element"
        key={uuidv4()}
        onClick={async () => {
          // handleTableCellClick(salahName, date);
          await doesSalahAndDateExists(salahName, cellDate);
          setShowUpdateStatusModal(true);
          setHasUserClickedDate(true);
        }}
      >
        {cellData}
      </div>
      {showUpdateStatusModal && (
        <PrayerStatusBottomSheet
          doesSalahAndDateExist={doesSalahAndDateExists}
          salahName={salahName}
          cellDate={cellDate}
          dbConnection={dbConnection}
          setSalahStatus={setSalahStatus}
          setSelectedReasons={setSelectedReasons}
          setReasonsArray={setReasonsArray}
          selectedReasonsArray={selectedReasonsArray}
          selectedReasons={selectedReasons}
          reasonsArray={reasonsArray}
          handleCustomReason={handleCustomReason}
          setNotes={setNotes}
          notes={notes}
          handleNotes={handleNotes}
          userGender={userGender}
          salahStatus={salahStatus}
          setShowUpdateStatusModal={setShowUpdateStatusModal}
          showUpdateStatusModal={showUpdateStatusModal}
          setHasUserClickedDate={setHasUserClickedDate}
          hasUserClickedDate={hasUserClickedDate}
          customReason={customReason}
          setShowAddCustomReasonInputBox={setShowAddCustomReasonInputBox}
          showAddCustomReasonInputBox={showAddCustomReasonInputBox}
        />
      )}
    </>
  );
};

export default PrayerTableCell;
