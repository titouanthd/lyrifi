'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  initialValue?: string;
}

const SearchInput = ({ onSearch, initialValue = '' }: SearchInputProps) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [value, onSearch]);

  const handleClear = () => {
    setValue('');
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-zinc-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-12 pr-10 py-3 bg-zinc-800 border-none rounded-full text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white text-sm"
        placeholder="Search for songs, artists, albums..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
