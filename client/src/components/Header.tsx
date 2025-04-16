import { useState, useEffect } from "react";
import { useLocation } from "wouter";
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
      setIsSearchExpanded(false); // Hide the mobile search box after submission
    }
  };
  
  // Check if we're already on the search page and extract the query
  useEffect(() => {
    if (location.startsWith('/search')) {
      const params = new URLSearchParams(location.split('?')[1]);
      const query = params.get('q');
      if (query) {
        setSearchQuery(query);
      }
    }
  }, [location]);
  
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
      
      <div className="flex items-center">
        <button 
          onClick={() => setIsSearchExpanded(!isSearchExpanded)}
          className="p-2 md:hidden rounded-full bg-background-lighter text-text-secondary hover:text-text-primary transition-colors mr-4"
        >
          <i className="ri-search-line text-xl"></i>
        </button>
        
        <div className="hidden md:block mr-4">
          <ThemeToggle />
        </div>
        
        <div 
          onClick={() => navigate("/profile")}
          className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors"
        >
          <i className="ri-user-fill text-lg"></i>
        </div>
      </div>
    </header>
  );
}
