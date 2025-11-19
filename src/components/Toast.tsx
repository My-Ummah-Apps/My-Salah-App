import { IonToast } from "@ionic/react";

interface IonToastProps {
  isOpen: boolean;
  setIsNextCounterLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  duration?: number;
}

const Toast = ({
  isOpen,
  setIsNextCounterLoading,
  message,
  setShow,
  duration,
}: IonToastProps) => {
  return (
    <IonToast
      isOpen={isOpen}
      onWillDismiss={() => {
        if (setIsNextCounterLoading) setIsNextCounterLoading(false);
      }}
      positionAnchor="nav-bar"
      message={message}
      duration={duration || 1500}
      onDidDismiss={() => setShow(false)}
    />
  );
};

export default Toast;
