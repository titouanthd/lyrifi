'use client';

import React, { useState, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import SearchInput from '@/components/organisms/SearchInput';
import SearchResults from '@/components/organisms/SearchResults';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [results, setResults] = useState({
    tracks: [],
    artists: [],
    albums: [],
    playlists: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (q) {
      params.set('q', q);
    } else {
      params.delete('q');
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });

    if (!q.trim()) {
      setResults({ tracks: [], artists: [], albums: [], playlists: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error('Search API returned an error');
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pathname, router, searchParams]);

  // Initial search from URL
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      handleSearch(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <SearchInput onSearch={handleSearch} initialValue={query} />
      </div>

      <SearchResults
        results={results}
        isLoading={isLoading}
        hasQuery={query.trim().length > 0}
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
