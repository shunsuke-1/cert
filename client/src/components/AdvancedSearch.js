import React, { useState } from 'react';

const AdvancedSearch = ({ 
  onSearch, 
  onSort, 
  onFilter, 
  sortOptions = [],
  filterOptions = [],
  placeholder = "検索...",
  currentSort = "",
  currentFilters = []
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  const handleFilterToggle = (filterValue) => {
    const newFilters = currentFilters.includes(filterValue)
      ? currentFilters.filter(f => f !== filterValue)
      : [...currentFilters, filterValue];
    onFilter(newFilters);
  };

  return (
    <div className="card-modern p-6 space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Sort Dropdown */}
        {sortOptions.length > 0 && (
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700">並び替え:</label>
            <select
              value={currentSort}
              onChange={(e) => onSort(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500 bg-white"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Filter Toggle */}
        {filterOptions.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              showFilters 
                ? 'bg-purple-100 text-purple-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
            </svg>
            <span>フィルター</span>
            {currentFilters.length > 0 && (
              <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                {currentFilters.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && filterOptions.length > 0 && (
        <div className="border-t border-gray-200 pt-4 animate-fadeInUp">
          <div className="space-y-3">
            {filterOptions.map(category => (
              <div key={category.name}>
                <h4 className="text-sm font-medium text-gray-700 mb-2">{category.label}:</h4>
                <div className="flex flex-wrap gap-2">
                  {category.options.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleFilterToggle(option.value)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        currentFilters.includes(option.value)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {option.label}
                      {option.count && (
                        <span className="ml-1 opacity-75">({option.count})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {currentFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
          <span className="text-sm text-gray-600">アクティブフィルター:</span>
          {currentFilters.map(filter => (
            <span
              key={filter}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
            >
              {filter}
              <button
                onClick={() => handleFilterToggle(filter)}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          ))}
          <button
            onClick={() => onFilter([])}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            すべてクリア
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;