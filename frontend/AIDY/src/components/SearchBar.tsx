
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading = false }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2 max-w-2xl mx-auto mb-8">
      <div className="relative flex-grow">
        <Input
          type="text"
          placeholder="Paste tourism location link here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-4 pr-12 py-6 rounded-lg bg-card border border-border"
        />
      </div>
      <Button 
        type="submit" 
        className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-6" 
        disabled={isLoading || !query.trim()}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span>Start Density Mapping</span>
          </div>
        )}
      </Button>
    </form>
  );
};

export default SearchBar;
