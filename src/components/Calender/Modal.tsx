import { parse } from "date-fns";
import PrayerMainView from "../PrayerMainView/PrayerMainView";

interface ModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
import ReactModal from "react-modal";

const Modal: React.FC<ModalProps> = ({
  setShowModal,
  showModal,
  setSalahTrackingArray,
  salahTrackingArray,
  setCurrentStartDate,
  currentStartDate,
  startDate,
}) => {
  //   const dateString = selectedDate;
  //   const startDate = parse(dateString, "dd.MM.yy", new Date());

  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={showModal}
      onRequestClose={() => {
        setShowModal(false);
      }}
    >
      <div>
        <PrayerMainView
          setSalahTrackingArray={setSalahTrackingArray}
          salahTrackingArray={salahTrackingArray}
          setCurrentStartDate={setCurrentStartDate}
          currentStartDate={currentStartDate}
          startDate={startDate}
        />
      </div>{" "}
    </ReactModal>
  );
};

export default Modal;
