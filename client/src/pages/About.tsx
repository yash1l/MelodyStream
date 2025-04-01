import Header from "@/components/Header";

export default function About() {
  return (
    <div>
      <Header />
      
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Melodify</h1>
        
        <div className="bg-background-card rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
          <p className="text-text-secondary mb-4">
            Melodify is a modern music streaming platform designed to connect you with the music you love. 
            Our mission is to provide a seamless and intuitive music experience where discovering, saving, 
            and enjoying your favorite songs is effortless.
          </p>
          <p className="text-text-secondary">
            We believe that music brings people together and enriches lives. That's why we've built a 
            platform that puts your music experience first with custom playlists, personalized recommendations, 
            and a clean, intuitive interface.
          </p>
        </div>
        
        <div className="bg-background-card rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-accent/20 rounded-md p-4">
              <div className="flex items-center mb-2">
                <i className="ri-playlist-fill text-xl text-primary mr-2"></i>
                <h3 className="font-semibold">Custom Playlists</h3>
              </div>
              <p className="text-text-secondary text-sm">
                Create and manage personal playlists with your favorite tracks, all in one place.
              </p>
            </div>
            
            <div className="border border-accent/20 rounded-md p-4">
              <div className="flex items-center mb-2">
                <i className="ri-heart-fill text-xl text-primary mr-2"></i>
                <h3 className="font-semibold">Liked Songs</h3>
              </div>
              <p className="text-text-secondary text-sm">
                Easily save your favorite songs to your Liked Songs collection for quick access.
              </p>
            </div>
            
            <div className="border border-accent/20 rounded-md p-4">
              <div className="flex items-center mb-2">
                <i className="ri-search-line text-xl text-primary mr-2"></i>
                <h3 className="font-semibold">Powerful Search</h3>
              </div>
              <p className="text-text-secondary text-sm">
                Find any song, artist, or album with our comprehensive search feature.
              </p>
            </div>
            
            <div className="border border-accent/20 rounded-md p-4">
              <div className="flex items-center mb-2">
                <i className="ri-equalizer-line text-xl text-primary mr-2"></i>
                <h3 className="font-semibold">Music Controls</h3>
              </div>
              <p className="text-text-secondary text-sm">
                Control your music with our intuitive player featuring play, pause, skip, and volume controls.
              </p>
            </div>
            
            <div className="border border-accent/20 rounded-md p-4">
              <div className="flex items-center mb-2">
                <i className="ri-moon-fill text-xl text-primary mr-2"></i>
                <h3 className="font-semibold">Dark Mode</h3>
              </div>
              <p className="text-text-secondary text-sm">
                Easy on the eyes with our carefully designed dark mode interface.
              </p>
            </div>
            
            <div className="border border-accent/20 rounded-md p-4">
              <div className="flex items-center mb-2">
                <i className="ri-smartphone-line text-xl text-primary mr-2"></i>
                <h3 className="font-semibold">Responsive Design</h3>
              </div>
              <p className="text-text-secondary text-sm">
                Enjoy Melodify on any device with our fully responsive layout.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-background-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Latest Updates</h2>
          
          <div className="border-l-2 border-primary pl-4 space-y-6">
            <div>
              <div className="flex items-center">
                <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">New</span>
                <h3 className="font-semibold ml-2">Version 1.0 Launch</h3>
              </div>
              <p className="text-text-secondary text-sm mt-1">
                Initial release with playlist management, music player, and search functionality.
              </p>
            </div>
            
            <div>
              <div className="flex items-center">
                <span className="bg-accent/20 text-text-secondary text-xs px-2 py-1 rounded-full">Upcoming</span>
                <h3 className="font-semibold ml-2">Offline Mode</h3>
              </div>
              <p className="text-text-secondary text-sm mt-1">
                Download your favorite songs to listen offline, coming soon!
              </p>
            </div>
            
            <div>
              <div className="flex items-center">
                <span className="bg-accent/20 text-text-secondary text-xs px-2 py-1 rounded-full">Upcoming</span>
                <h3 className="font-semibold ml-2">Social Sharing</h3>
              </div>
              <p className="text-text-secondary text-sm mt-1">
                Share your favorite playlists with friends and follow other users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
