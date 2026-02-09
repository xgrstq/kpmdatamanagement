export default function topbar({ onMenuClick }) {
  return (
    <div className="bg-navblue border-b border-bordersoft px-4 md:px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        {/* Hamburger */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-700 text-2xl font-bold"
        >
          ☰
        </button>

        <h2 className="font-bold text-greenmain text-lg">
          Sistem Pendataan KPM
        </h2>
      </div>

      <div className="text-sm text-gray-600">
        Admin
      </div>
    </div>
  );
}
