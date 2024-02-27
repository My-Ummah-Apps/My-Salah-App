import { FaBookOpen } from "react-icons/fa";
import { GiArabicDoor } from "react-icons/gi";

const ResourcesPage = ({
  title,
  pageStyles,
}: {
  title: React.ReactNode;
  pageStyles: string;
}) => {
  return (
    <section className={pageStyles}>
      {title}
      <div className="grid grid-cols-2 gap-10 cards-wrap">
        <div className="flex flex-col items-center justify-center shadow-md w-36 h-28 bg-[var(--card-bg-color)] rounded-md gap-2">
          <FaBookOpen style={{ fontSize: "2rem" }} />
          <p>Quran Verses</p>
        </div>
        <div className="flex flex-col items-center justify-center shadow-md w-36 h-28 bg-[var(--card-bg-color)] rounded-md gap-2">
          <FaBookOpen style={{ fontSize: "2rem" }} />
          <p>Ahadeeth</p>
        </div>
        <div className="flex flex-col items-center justify-center shadow-md w-36 h-28 bg-[var(--card-bg-color)] rounded-md gap-2">
          <FaBookOpen style={{ fontSize: "2rem" }} />
          <p>Guide</p>
        </div>
        <div className="flex flex-col items-center justify-center shadow-md w-36 h-28 bg-[var(--card-bg-color)] rounded-md gap-2">
          <GiArabicDoor style={{ fontSize: "2rem" }} />
          <p>Meanings</p>
        </div>
        {/* <div className="flex flex-col items-center justify-center shadow-md w-36 h-28 bg-[var(--card-bg-color)] rounded-md gap-2">
          <p>Icon</p>
          <p>Text</p>
        </div> */}
      </div>
    </section>
  );
};

export default ResourcesPage;
