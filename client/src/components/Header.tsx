import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, navigate] = useLocation();
  
  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  return (
    <header className="sticky top-0 bg-background-dark/90 backdrop-blur-md z-10 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <nav className="flex space-x-1">
          <button onClick={() => window.history.back()} className="p-2 rounded-full bg-background-darker text-text-secondary hover:text-text-primary transition-colors">
            <i className="ri-arrow-left-s-line text-xl"></i>
          </button>
          <button onClick={() => window.history.forward()} className="p-2 rounded-full bg-background-darker text-text-secondary hover:text-text-primary transition-colors">
            <i className="ri-arrow-right-s-line text-xl"></i>
          </button>
        </nav>
        
        <div className={`ml-6 relative ${isSearchExpanded ? 'block' : 'hidden md:block'}`}>
          <form onSubmit={handleSearchSubmit}>
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"></i>
            <input 
              type="text" 
              placeholder="Search songs, artists, albums..." 
              className="bg-background-lighter rounded-full pl-10 pr-4 py-2 w-80 focus:outline-none focus:ring-1 focus:ring-primary text-sm search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setIsSearchExpanded(!isSearchExpanded)} 
          className="p-2 md:hidden rounded-full bg-background-lighter text-text-secondary hover:text-text-primary transition-colors"
        >
          <i className="ri-search-line text-xl"></i>
        </button>
        
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
        
        <Link href="/profile">
          <a className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
            <i className="ri-user-fill text-lg"></i>
          </a>
        </Link>
      </div>
    </header>
  );
}
