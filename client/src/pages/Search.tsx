import { useEffect, useState } from "react";
import Header from "@/components/Header";
import SongCard from "@/components/SongCard";
import { useMusicContext } from "@/context/MusicContext";
import { useLocation } from "wouter";
import { Song, Artist } from "@shared/schema";

export default function Search() {
  const { topSongs, featuredArtists, songsByArtist } = useMusicContext();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    songs: Song[];
    artists: Artist[];
  }>({ songs: [], artists: [] });
  const [isSearching, setIsSearching] = useState(false);
  
  // Parse query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    } else {
      setSearchQuery("");
      setSearchResults({ songs: [], artists: [] });
      setIsSearching(false);
    }
  }, [location]);
  
  // Perform search based on query
  const performSearch = async (query: string) => {
    setIsSearching(true);
    
    try {
      // Search functionality would ideally call a backend API
      // For now, we'll filter the existing data
      const filteredSongs = topSongs.filter(song => 
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase()) ||
        (song.album && song.album.toLowerCase().includes(query.toLowerCase()))
      );
      
      const filteredArtists = featuredArtists.filter(artist => 
        artist.name.toLowerCase().includes(query.toLowerCase())
      );
      
      setSearchResults({
        songs: filteredSongs,
        artists: filteredArtists
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };
  
  return (
    <div>
      <Header />
      
      <div className="px-6 py-4">
        {searchQuery ? (
          // Search Results
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Search Results for "{searchQuery}"
            </h2>
            
            {isSearching ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div>
                {/* Artist Results */}
                {searchResults.artists.length > 0 && (
                  <section className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Artists</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                      {searchResults.artists.map(artist => (
                        <div key={artist.id} className="bg-background-card p-4 rounded-lg hover:bg-background-card/80 transition-all cursor-pointer">
                          <div className="aspect-square mb-4 rounded-full overflow-hidden">
                            <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
                          </div>
                          <h4 className="text-center text-base font-semibold">{artist.name}</h4>
                          <p className="text-center text-sm text-text-secondary">Artist</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
                
                {/* Song Results */}
                {searchResults.songs.length > 0 ? (
                  <section>
                    <h3 className="text-xl font-semibold mb-4">Songs</h3>
                    <div className="bg-background-card rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="border-b border-accent/30">
                          <tr className="text-text-secondary text-left text-sm">
                            <th className="p-4 font-medium w-14">#</th>
                            <th className="p-4 font-medium">TITLE</th>
                            <th className="p-4 font-medium hidden md:table-cell">ALBUM</th>
                            <th className="p-4 font-medium text-right w-20">
                              <i className="ri-time-line"></i>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchResults.songs.map((song, index) => (
                            <SongCard 
                              key={song.id} 
                              song={song} 
                              index={index + 1} 
                              showIndex={true}
                              layout="list" 
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                ) : (
                  <div className="bg-background-card rounded-lg p-8 text-center">
                    <i className="ri-search-line text-5xl text-text-secondary mb-4"></i>
                    <h3 className="text-xl font-semibold mb-2">No results found</h3>
                    <p className="text-text-secondary">
                      Try searching for something else
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          // Browse Categories
          <div>
            <h2 className="text-2xl font-bold mb-6">Browse</h2>
            
            {/* Categories Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              <div className="aspect-square bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg p-6 flex items-end cursor-pointer hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold">Charts</h3>
              </div>
              <div className="aspect-square bg-gradient-to-br from-red-600 to-orange-500 rounded-lg p-6 flex items-end cursor-pointer hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold">New Releases</h3>
              </div>
              <div className="aspect-square bg-gradient-to-br from-green-600 to-emerald-500 rounded-lg p-6 flex items-end cursor-pointer hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold">Podcasts</h3>
              </div>
              <div className="aspect-square bg-gradient-to-br from-pink-600 to-rose-500 rounded-lg p-6 flex items-end cursor-pointer hover:shadow-lg transition-all">
                <h3 className="text-xl font-bold">Genres</h3>
              </div>
            </div>
            
            {/* Featured Artists */}
            <section className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Popular Artists</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {featuredArtists.map(artist => (
                  <div key={artist.id} className="bg-background-card p-4 rounded-lg hover:bg-background-card/80 transition-all cursor-pointer">
                    <div className="aspect-square mb-4 rounded-full overflow-hidden">
                      <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
                    </div>
                    <h4 className="text-center text-base font-semibold">{artist.name}</h4>
                    <p className="text-center text-sm text-text-secondary">Artist</p>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Top Songs */}
            <section>
              <h3 className="text-xl font-semibold mb-4">Today's Top Hits</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
                {topSongs.map(song => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
