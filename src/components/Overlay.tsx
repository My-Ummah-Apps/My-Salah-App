const Overlay = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        zIndex: 9999,
        pointerEvents: "auto",
      }}
    />
  );
};

export default Overlay;
