const QiblahDirection = ({
  // title,
  setHeading,
  pageStyles,
}: {
  // title: React.ReactNode;
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  pageStyles: string;
}) => {
  setHeading("Qibla Direction");

  return <section className={pageStyles}>{/* <h1>{title}</h1> */}</section>;
};

export default QiblahDirection;
