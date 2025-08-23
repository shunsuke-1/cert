import React, { useState } from "react";

const SearchBar = ({ onSearch, placeholder = "記事を検索..." }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="card-modern p-6 mb-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center gap-4"
      >
        <div className="relative w-full sm:flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-lg"
          />
        </div>
        <button
          type="submit"
          className="btn-primary px-6 py-3 w-full sm:w-auto"
        >
          🔍 検索
        </button>
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="btn-secondary px-6 py-3 w-full sm:w-auto"
          >
            クリア
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
