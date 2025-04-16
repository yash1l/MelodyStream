import { useEffect, useState } from "react";
import Header from "@/components/Header";
import SongCard from "@/components/SongCard";
import { useMusicContext } from "@/context/MusicContext";
import { useLocation } from "wouter";
import { Song, Artist } from "@shared/schema";

export default function Search() {
  const { topSongs, featuredArtists, songsByArtist, isLoaded } = useMusicContext();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{
    songs: Song[];
    artists: Artist[];
  }>({ songs: [], artists: [] });
  const [isSearching, setIsSearching] = useState(false);
  
  // Perform search based on query
  const performSearch = async (query: string) => {
    setIsSearching(true);
    
    try {
      // Make sure we have data loaded before searching
      if (!isLoaded) {
        // Delay search until data is loaded
        setTimeout(() => performSearch(query), 500);
        return;
      }
      
      // Get all available songs for searching (not just top songs)
      const allSongs: Song[] = [];
      
      // Add top songs
      allSongs.push(...topSongs);
      
      // Add songs from artists
      Object.values(songsByArtist).forEach(artistSongs => {
        allSongs.push(...artistSongs.filter(s => 
          !allSongs.some(existing => existing.id === s.id)
        ));
      });
      
      // Filter songs based on query
      const filteredSongs = allSongs.filter(song => 
        song.title.toLowerCase().includes(query.toLowerCase()) ||
        song.artist.toLowerCase().includes(query.toLowerCase()) ||
        (song.album && song.album.toLowerCase().includes(query.toLowerCase()))
      );
      
      // Filter artists based on query
      const filteredArtists = featuredArtists.filter(artist => 
        artist.name.toLowerCase().includes(query.toLowerCase())
      );
      
      // Update search results
      setSearchResults({
        songs: filteredSongs,
        artists: filteredArtists
      });
      
      console.log("Search results:", filteredSongs.length, "songs,", filteredArtists.length, "artists");
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Parse query from URL and perform search
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
  }, [location, isLoaded]);
  
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
                      {searchResults.artists.map(artist => {
                        const artistSongs = songsByArtist[artist.id] || [];
                        
                        return (
                          <div 
                            key={artist.id}
                            onClick={() => {
                              if (artistSongs.length > 0) {
                                // Show artist page with songs
                                const artistPageUrl = `/artist?id=${artist.id}`;
                                window.location.href = artistPageUrl;
                              }
                            }} 
                            className={`bg-background-card p-4 rounded-lg hover:bg-background-card/80 transition-all ${artistSongs.length > 0 ? 'cursor-pointer' : 'cursor-default'}`}
                          >
                            <div className="aspect-square mb-4 rounded-full overflow-hidden">
                              <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
                            </div>
                            <h4 className="text-center text-base font-semibold">{artist.name}</h4>
                            <p className="text-center text-sm text-text-secondary">
                              Artist
                              {artistSongs.length > 0 && ` • ${artistSongs.length} songs`}
                            </p>
                          </div>
                        );
                      })}
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
                {featuredArtists.map(artist => {
                  const artistSongs = songsByArtist[artist.id] || [];
                  
                  return (
                    <div 
                      key={artist.id}
                      onClick={() => {
                        if (artistSongs.length > 0) {
                          // Show artist page with songs
                          const artistPageUrl = `/artist?id=${artist.id}`;
                          window.location.href = artistPageUrl;
                        }
                      }} 
                      className={`bg-background-card p-4 rounded-lg hover:bg-background-card/80 transition-all ${artistSongs.length > 0 ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <div className="aspect-square mb-4 rounded-full overflow-hidden">
                        <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="text-center text-base font-semibold">{artist.name}</h4>
                      <p className="text-center text-sm text-text-secondary">
                        Artist
                        {artistSongs.length > 0 && ` • ${artistSongs.length} songs`}
                      </p>
                    </div>
                  );
                })}
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
