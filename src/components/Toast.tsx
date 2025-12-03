import { IonToast } from "@ionic/react";

interface IonToastProps {
  isOpen: boolean;
  setIsNextCounterLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  duration?: number;
  testId: string;
}

const Toast = ({
  isOpen,
  setIsNextCounterLoading,
  message,
  setShow,
  duration,
  testId,
}: IonToastProps) => {
  return (
    <IonToast
      data-testid={testId}
      isOpen={isOpen}
      onWillDismiss={() => {
        if (setIsNextCounterLoading) setIsNextCounterLoading(false);
      }}
      positionAnchor="nav-bar"
      message={message}
      duration={duration || 2000}
      onDidDismiss={() => setShow(false)}
    />
  );
};

export default Toast;
