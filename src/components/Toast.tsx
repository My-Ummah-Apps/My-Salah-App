import { IonToast } from "@ionic/react";

interface IonToastProps {
  isOpen: boolean;
  message: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  duration?: number;
  testId: string;
}

const Toast = ({
  isOpen,
  message,
  setShow,
  duration,
  testId,
}: IonToastProps) => {
  return (
    <IonToast
      data-testid={testId}
      isOpen={isOpen}
      positionAnchor="nav-bar"
      message={message}
      duration={duration || 2000}
      onDidDismiss={() => setShow(false)}
    />
  );
};

export default Toast;
