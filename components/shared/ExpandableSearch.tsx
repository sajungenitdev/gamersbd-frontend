import { Search } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const ExpandableSearch = () => {
  return (
    <div>
      <Link href={"/search"}
        className="flex h-10 w-10 items-center justify-center bg-transparent border border-gray-700 text-orange-500 hover:text-orange-400 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
        aria-label="Open search"
      >
        <Search className="h-5 w-5" />
      </Link>
    </div>
  );
};

export default ExpandableSearch;