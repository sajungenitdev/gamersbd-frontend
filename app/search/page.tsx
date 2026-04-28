"use client";

import React, { Suspense } from "react";
import SearchComps from "../../components/shared/Search/SearchComps";

// Create a component that uses useSearchParams
function SearchContent() {
  return <SearchComps />;
}

// Main page component with Suspense boundary
const SearchPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage;