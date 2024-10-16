// import { useState } from "react";
import { MdOutlineChevronRight } from "react-icons/md";

const SettingIndividual = ({
  headingText,
  subText,
  indvidualStyles,
  onClick,
}: // onChange,
{
  headingText: string;
  subText: string;
  indvidualStyles?: string;
  onClick?: () => void;
  // onChange?: (e: any) => Promise<void>;
}) => {
  return (
    <>
      <div
        className={`flex items-center justify-between py-1 shadow-md individual-setting-wrap bg-[color:var(--card-bg-color)] mx-auto p-0.5 ${indvidualStyles}`}
        onClick={onClick}
      >
        <div className="mx-2">
          <p className="support-main-text-heading pt-[0.3rem] pb-[0.1rem] text-lg">
            {headingText}
          </p>
          <p className="support-sub-text pt-[0.3rem]  pb-[0.1rem] text-[0.8rem] font-light">
            {subText}
          </p>
        </div>

        <MdOutlineChevronRight className="chevron text-[#b5b5b5]" />
      </div>
    </>
  );
};

{
  /* <div className="lds-ellipsis">
<div></div>
<div></div>
<div></div>
<div></div>
</div> */
}

export default SettingIndividual;
