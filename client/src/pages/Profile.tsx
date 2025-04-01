import { useState } from "react";
import Header from "@/components/Header";
import { useMusicContext } from "@/context/MusicContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

export default function Profile() {
  const { playlists, likedSongs, setVolume, volume } = useMusicContext();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [notifications, setNotifications] = useState(true);
  
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
  
  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };
  
  return (
    <div>
      <Header />
      
      <div className="px-6 py-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Info */}
          <div className="w-full md:w-1/3">
            <div className="bg-background-card rounded-lg p-6 mb-6">
              <div className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                  <i className="ri-user-fill text-4xl"></i>
                </div>
                <h2 className="text-xl font-semibold">User</h2>
                <p className="text-text-secondary text-sm">Joined 2023</p>
                
                <div className="flex items-center gap-4 mt-4">
                  <div className="text-center">
                    <div className="text-xl font-semibold">{playlists.length}</div>
                    <div className="text-text-secondary text-xs">Playlists</div>
                  </div>
                  <div className="h-10 border-l border-accent/30"></div>
                  <div className="text-center">
                    <div className="text-xl font-semibold">{likedSongs.length}</div>
                    <div className="text-text-secondary text-xs">Liked</div>
                  </div>
                </div>
                
                <button className="mt-6 py-2 px-4 w-full rounded-md border border-accent text-sm font-medium hover:bg-accent/20 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
            
            <div className="bg-background-card rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
                  <i className="ri-shield-keyhole-line mr-3 text-lg"></i>
                  <span className="text-sm">Privacy Settings</span>
                </li>
                <li className="flex items-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
                  <i className="ri-device-line mr-3 text-lg"></i>
                  <span className="text-sm">Connected Devices</span>
                </li>
                <li className="flex items-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
                  <i className="ri-history-line mr-3 text-lg"></i>
                  <span className="text-sm">Listening History</span>
                </li>
                <li className="flex items-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
                  <i className="ri-logout-box-r-line mr-3 text-lg"></i>
                  <span className="text-sm">Sign Out</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Settings Tabs */}
          <div className="w-full md:w-2/3">
            <div className="bg-background-card rounded-lg p-6">
              <Tabs defaultValue="preferences">
                <TabsList className="mb-6">
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="audio">Audio</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preferences">
                  <h3 className="text-lg font-semibold mb-4">App Preferences</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <p className="text-text-secondary text-sm">Use dark theme for the application</p>
                      </div>
                      <Switch 
                        id="dark-mode" 
                        checked={isDarkMode}
                        onCheckedChange={toggleTheme}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoplay">Autoplay</Label>
                        <p className="text-text-secondary text-sm">Automatically play songs when clicked</p>
                      </div>
                      <Switch 
                        id="autoplay" 
                        checked={autoplay}
                        onCheckedChange={setAutoplay}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notifications">Notifications</Label>
                        <p className="text-text-secondary text-sm">Enable push notifications</p>
                      </div>
                      <Switch 
                        id="notifications" 
                        checked={notifications}
                        onCheckedChange={setNotifications}
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-accent/20">
                      <h4 className="font-medium mb-2">Language</h4>
                      <select className="w-full bg-background-lighter rounded p-2 text-sm language-select">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="audio">
                  <h3 className="text-lg font-semibold mb-4">Audio Settings</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="volume" className="mb-4 block">
                        Default Volume ({Math.round(volume * 100)}%)
                      </Label>
                      <Slider 
                        id="volume" 
                        defaultValue={[volume * 100]} 
                        max={100} 
                        step={1}
                        onValueChange={handleVolumeChange}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="normalize">Normalize Volume</Label>
                        <p className="text-text-secondary text-sm">Keep volume level consistent between songs</p>
                      </div>
                      <Switch 
                        id="normalize" 
                        defaultChecked={true}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="crossfade">Crossfade</Label>
                        <p className="text-text-secondary text-sm">Smooth transition between songs</p>
                      </div>
                      <Switch 
                        id="crossfade" 
                        defaultChecked={true}
                      />
                    </div>
                    
                    <div className="pt-4 border-t border-accent/20">
                      <h4 className="font-medium mb-2">Audio Quality</h4>
                      <select className="w-full bg-background-lighter rounded p-2 text-sm language-select">
                        <option>Normal (128kbps)</option>
                        <option>High (256kbps)</option>
                        <option>Very High (320kbps)</option>
                      </select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="about">
                  <h3 className="text-lg font-semibold mb-4">About Melodify</h3>
                  
                  <div className="space-y-4">
                    <p className="text-text-secondary">
                      Melodify is a modern music streaming platform designed to connect you with the music you love.
                    </p>
                    
                    <div className="pt-4">
                      <h4 className="font-medium mb-2">Version</h4>
                      <p className="text-text-secondary text-sm">1.0.0</p>
                    </div>
                    
                    <div className="pt-4">
                      <h4 className="font-medium mb-2">Terms of Service</h4>
                      <a href="#" className="text-primary text-sm hover:underline">Read our Terms of Service</a>
                    </div>
                    
                    <div className="pt-4">
                      <h4 className="font-medium mb-2">Privacy Policy</h4>
                      <a href="#" className="text-primary text-sm hover:underline">Read our Privacy Policy</a>
                    </div>
                    
                    <div className="pt-4">
                      <h4 className="font-medium mb-2">Contact Support</h4>
                      <a href="mailto:support@melodify.com" className="text-primary text-sm hover:underline">support@melodify.com</a>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
