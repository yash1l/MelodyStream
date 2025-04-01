import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [location, navigate] = useLocation();
  
  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);
  
  // Toggle dark/light mode
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };
  
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
        
        <button 
          onClick={toggleTheme}
          className="hidden md:flex items-center bg-background-lighter rounded-full px-4 py-1.5 hover:bg-accent/30 transition-colors"
        >
          <i className={`${isDarkMode ? 'ri-moon-fill' : 'ri-sun-fill'} mr-2 text-text-secondary`}></i>
          <span className="font-medium text-sm">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        
        <Link href="/profile">
          <a className="h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors">
            <i className="ri-user-fill text-lg"></i>
          </a>
        </Link>
      </div>
    </header>
  );
}
