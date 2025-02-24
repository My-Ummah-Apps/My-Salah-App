import Sheet from "react-modal-sheet";
import {
  bottomSheetContainerStyles,
  sheetBackdropColor,
  sheetHeaderHeight,
  TWEEN_CONFIG,
} from "../../utils/constants";

const link = (url) => {
  window.location.href = url;
};

interface BottomSheetAboutUsProps {
  setShowAboutUsModal: React.Dispatch<React.SetStateAction<boolean>>;
  showAboutUsModal: boolean;
}

const BottomSheetAboutUs = ({
  setShowAboutUsModal,
  showAboutUsModal,
}: BottomSheetAboutUsProps) => {
  return (
    <Sheet
      detent="content-height"
      tweenConfig={TWEEN_CONFIG}
      isOpen={showAboutUsModal}
      onClose={() => setShowAboutUsModal(false)}
    >
      <Sheet.Container style={bottomSheetContainerStyles}>
        <Sheet.Header style={sheetHeaderHeight} />
        <Sheet.Content>
          <div className="pt-4 pb-12 rounded-lg">
            <div className="text-center">
              <img
                className="block mx-auto mb-2"
                src="/src/assets/images/My-Ummah-Apps-72ppi.png"
                height="50"
                width="40%"
                alt=""
              />

              <p className="p-4 text-sm leading-5">
                MyUmmahApps Ltd is an organization driven by a passionate
                commitment to empower the Muslim community through privacy
                friendly Open Source Mobile Applications.{" "}
              </p>
            </div>
            <div className="flex w-4/5 mx-auto">
              <div
                className="w-2/5 p-2 mx-auto mt-2 text-xs leading-4 text-center text-white bg-blue-500 rounded-md"
                onClick={() => {
                  link("https://github.com/My-Ummah-Apps/My-Salah-App");
                }}
              >
                <p> View App Source Code</p>
              </div>
            </div>
            <div className="mx-4 mt-10 text-sm text-center">
              <p>App Icon by: </p>
              <a
                className="text-xs underline text-inherit"
                href="https://www.flaticon.com/authors/zane-priedite"
                title="number icons"
              >
                Zane Priedite - Flaticon
              </a>
            </div>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop
        style={sheetBackdropColor}
        onTap={() => setShowAboutUsModal(false)}
      />
    </Sheet>
  );
};

export default BottomSheetAboutUs;
