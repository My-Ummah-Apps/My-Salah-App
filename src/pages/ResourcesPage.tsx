const StatsPage = () => {
  return (
    <section>
      <h1>Resources Page</h1>
      <div className="grid grid-cols-2 gap-6 cards-wrap ">
        <div className="rounded-lg shadow-md w-44 h-28 bg-amber-800">
          <p>Icon</p>
          <p>Ahadeeth</p>
        </div>
        <div className="rounded-lg shadow-md w-44 h-28 bg-amber-800">
          <p>Icon</p>
          <p>Verses</p>
        </div>
        <div className="rounded-lg shadow-md w-44 h-28 bg-amber-800">
          <p>Icon</p>
          <p>Salah Guide</p>
        </div>
        <div className="rounded-lg shadow-md w-44 h-28 bg-amber-800">
          <p>Icon</p>
          <p>Meanings of what is prayed within salah</p>
        </div>
        <div className="rounded-lg shadow-md w-44 h-28 bg-amber-800">
          <p>Icon</p>
          <p>Text</p>
        </div>
      </div>
    </section>
  );
};

export default StatsPage;
