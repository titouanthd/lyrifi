import React from 'react';
import Link from 'next/link';
import { Home, Search, Library, PlusSquare, Heart } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-black h-full flex flex-col text-gray-400 p-6">
      <div className="mb-8">
        <h1 className="text-white text-2xl font-bold">Lyrifi</h1>
      </div>
      <nav className="flex-1 space-y-4">
        <Link href="/" className="flex items-center space-x-3 hover:text-white transition">
          <Home size={24} />
          <span className="font-semibold">Home</span>
        </Link>
        <Link href="/search" className="flex items-center space-x-3 hover:text-white transition">
          <Search size={24} />
          <span className="font-semibold">Search</span>
        </Link>
        <Link href="/library" className="flex items-center space-x-3 hover:text-white transition">
          <Library size={24} />
          <span className="font-semibold">Your Library</span>
        </Link>
        <div className="pt-6 space-y-4">
          <button className="flex items-center space-x-3 hover:text-white transition">
            <PlusSquare size={24} />
            <span className="font-semibold">Create Playlist</span>
          </button>
          <button className="flex items-center space-x-3 hover:text-white transition text-purple-500">
            <Heart size={24} fill="currentColor" />
            <span className="font-semibold text-gray-400 hover:text-white">Liked Songs</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
