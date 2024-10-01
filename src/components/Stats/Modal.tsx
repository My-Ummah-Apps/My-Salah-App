// import { parse } from "date-fns";
// import PrayerMainView from "../PrayerMainView/PrayerMainView";

import ReactModal from "react-modal";

const Modal = ({
  setShowModal,
  showModal, // setSalahTrackingArray,
  // salahTrackingArray,
} // setCurrentWeek,
// currentWeek,
// startDate,
: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;

  setCurrentWeek: React.Dispatch<React.SetStateAction<number>>;
  currentWeek: number;

  startDate: Date;
}) => {
  //   const dateString = selectedDate;
  //   const startDate = parse(dateString, "dd.MM.yy", new Date());

  return (
    <ReactModal
      style={{ content: { background: "rgb(33, 36, 38)" } }}
      ariaHideApp={false}
      isOpen={showModal}
      onRequestClose={() => {
        setShowModal(false);
      }}
    >
      {/* <div>
        <PrayerMainView
          setSalahTrackingArray={setSalahTrackingArray}
          salahTrackingArray={salahTrackingArray}
          setCurrentWeek={setCurrentWeek}
          currentWeek={currentWeek}
          startDate={startDate}
        />
      </div>{" "} */}
    </ReactModal>
  );
};

export default Modal;
