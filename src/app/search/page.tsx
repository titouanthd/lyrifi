'use client';

import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import SearchInput from '@/components/organisms/SearchInput';
import SearchResults from '@/components/organisms/SearchResults';

function SearchContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Get query directly from URL. No more 'const [query, setQuery]'
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState({ tracks: [], artists: [], albums: [], playlists: [] });
  const [isLoading, setIsLoading] = useState(false);

  // 2. Stable search handler. No searchParams dependency!
  const handleSearch = useCallback((newQuery: string) => {
    const params = new URLSearchParams(window.location.search); // Use window instead of hook to avoid dependency
    if (newQuery) {
      params.set('q', newQuery);
    } else {
      params.delete('q');
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router]);

  // 3. Single Effect to fetch data whenever the URL query changes
  useEffect(() => {
    const fetchData = async () => {
      if (!query.trim()) {
        setResults({ tracks: [], artists: [], albums: [], playlists: [] });
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [query]); // Only runs when the 'q' in the URL actually changes

  return (
      <div className="flex flex-col">
        <div className="mb-8">
          <SearchInput onSearch={handleSearch} initialValue={query} />
        </div>
        <SearchResults
            results={results}
            isLoading={isLoading}
            hasQuery={query.length > 0}
        />
      </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-zinc-400">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
