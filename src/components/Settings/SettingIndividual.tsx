import { MdOutlineChevronRight } from "react-icons/md";

const SettingIndividual = ({
  id,
  headingText,
  subText,
  onClick,
}: {
  id?: string;
  headingText: string;
  subText: string;
  onClick?: () => void;
}) => {
  return (
    <div id={id} className="group pl-[1.125rem]" onClick={onClick}>
      <div className="flex items-center justify-between gap-3 border-t border-[color:var(--sheet-divider-color)] py-3 pr-[1.125rem] group-first:border-t-0">
        <div>
          <p className="text-base font-medium leading-snug">{headingText}</p>
          <p className="mt-0.5 text-[0.8125rem] leading-snug text-[var(--secondary-text-color)]">
            {subText}
          </p>
        </div>
        <MdOutlineChevronRight
          aria-hidden="true"
          className="shrink-0 text-xl text-[var(--secondary-text-color)]"
        />
      </div>
    </div>
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
