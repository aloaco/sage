import React from "react";
import { useProjectStore } from "../../store/useProjectStore";

const CacheControls: React.FC = () => {
  const { isCacheEnabled, setCacheEnabled } = useProjectStore();

  const handleClearCache = () => {
    let clearedCount = 0;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("cache-")) {
        localStorage.removeItem(key);
        clearedCount++;
      }
    });
    alert(`${clearedCount} cache entries cleared!`);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4 z-50">
      <div className="flex items-center space-x-2">
        <label htmlFor="cache-toggle" className="text-sm font-medium">
          Cache Mode
        </label>
        <input
          type="checkbox"
          id="cache-toggle"
          checked={isCacheEnabled}
          onChange={(e) => setCacheEnabled(e.target.checked)}
          className="h-6 w-6 rounded-md"
        />
      </div>
      <button
        onClick={handleClearCache}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md text-sm"
      >
        Clear Cache
      </button>
    </div>
  );
};

export default CacheControls;
