interface ModalProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}
import ReactModal from "react-modal";

const Modal: React.FC<ModalProps> = ({ setShowModal, showModal }) => {
  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={showModal}
      onRequestClose={() => {
        setShowModal(false);
      }}
    >
      <div>
        <p>Hello</p>
      </div>{" "}
    </ReactModal>
  );
};

export default Modal;
