import { useLocation } from "wouter";
import { useMusicContext } from "@/context/MusicContext";

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const { playlists } = useMusicContext();
  
  const navigate = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setLocation(path);
  };

  return (
    <aside className="sidebar bg-background-darker fixed h-full z-20 w-[70px] hover:w-[240px] overflow-hidden transition-all duration-300 group border-r border-border/30">
      <div className="h-full flex flex-col pt-5 px-3">
        <div className="flex items-center mb-8 pl-2">
          <i className="ri-music-fill text-primary text-2xl group-hover:scale-110 transition-transform"></i>
          <h1 className="sidebar-text text-xl font-bold ml-3 rainbow-text opacity-0 transition-opacity">Melodify</h1>
        </div>
        
        <nav>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={navigate("/")}
                className={`w-full flex items-center px-2 py-3 rounded-md hover:bg-background-lighter ${location === '/' ? 'bg-background-lighter' : ''}`}
              >
                <i className={`ri-home-5-fill text-2xl group-hover:scale-110 transition-transform ${location === '/' ? 'text-primary' : 'hover:text-primary'}`}></i>
                <span className="sidebar-text ml-4 font-medium opacity-0 transition-opacity">Home</span>
              </button>
            </li>
            <li>
              <button 
                onClick={navigate("/search")}
                className={`w-full flex items-center px-2 py-3 rounded-md hover:bg-background-lighter ${location === '/search' ? 'bg-background-lighter' : ''}`}
              >
                <i className={`ri-search-line text-2xl group-hover:scale-110 transition-transform ${location === '/search' ? 'text-primary' : 'hover:text-primary'}`}></i>
                <span className="sidebar-text ml-4 font-medium opacity-0 transition-opacity">Search</span>
              </button>
            </li>
            <li>
              <button 
                onClick={navigate("/library")}
                className={`w-full flex items-center px-2 py-3 rounded-md hover:bg-background-lighter ${location === '/library' ? 'bg-background-lighter' : ''}`}
              >
                <i className={`ri-music-2-fill text-2xl group-hover:scale-110 transition-transform ${location === '/library' ? 'text-primary' : 'hover:text-primary'}`}></i>
                <span className="sidebar-text ml-4 font-medium opacity-0 transition-opacity">Library</span>
              </button>
            </li>
            <li>
              <button 
                onClick={navigate("/notifications")}
                className={`w-full flex items-center px-2 py-3 rounded-md hover:bg-background-lighter ${location === '/notifications' ? 'bg-background-lighter' : ''}`}
              >
                <i className={`ri-notification-3-line text-2xl group-hover:scale-110 transition-transform ${location === '/notifications' ? 'text-primary' : 'hover:text-primary'}`}></i>
                <span className="sidebar-text ml-4 font-medium opacity-0 transition-opacity">Notifications</span>
              </button>
            </li>
            <li>
              <button 
                onClick={navigate("/about")}
                className={`w-full flex items-center px-2 py-3 rounded-md hover:bg-background-lighter ${location === '/about' ? 'bg-background-lighter' : ''}`}
              >
                <i className={`ri-information-line text-2xl group-hover:scale-110 transition-transform ${location === '/about' ? 'text-primary' : 'hover:text-primary'}`}></i>
                <span className="sidebar-text ml-4 font-medium opacity-0 transition-opacity">About</span>
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="mt-8 border-t border-accent pt-6">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={navigate("/library?playlist=liked")}
                className={`w-full flex items-center px-2 py-2 rounded-md hover:bg-background-lighter ${location === '/library?playlist=liked' ? 'bg-background-lighter' : ''}`}
              >
                <i className="ri-heart-fill text-xl text-primary group-hover:scale-110 transition-transform"></i>
                <span className="sidebar-text ml-4 text-sm opacity-0 transition-opacity">Liked Songs</span>
              </button>
            </li>
          </ul>
        </div>
        
        <div className="mt-auto mb-6">
          <button 
            onClick={navigate("/profile")}
            className={`w-full flex items-center px-2 py-3 rounded-md hover:bg-background-lighter ${location === '/profile' ? 'bg-background-lighter' : ''}`}
          >
            <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <i className="ri-user-fill text-lg"></i>
            </div>
            <span className="sidebar-text ml-3 font-medium opacity-0 transition-opacity">Your Profile</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
