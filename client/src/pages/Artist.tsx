import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import SongCard from "@/components/SongCard";
import { useMusicContext } from "@/context/MusicContext";
import { Artist as ArtistType, Song } from "@shared/schema";

export default function Artist() {
  const { songsByArtist, featuredArtists, playSong } = useMusicContext();
  const [location] = useLocation();
  const [artistId, setArtistId] = useState<number | null>(null);
  const [artist, setArtist] = useState<ArtistType | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Parse artist ID from URL
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const id = params.get('id');
    
    if (id && !isNaN(parseInt(id))) {
      setArtistId(parseInt(id));
    }
  }, [location]);

  // Load artist data when ID changes
  useEffect(() => {
    if (artistId === null) return;
    
    setIsLoading(true);
    
    // Find artist in featured artists
    const foundArtist = featuredArtists.find(a => a.id === artistId);
    
    if (foundArtist) {
      setArtist(foundArtist);
      
      // Get songs by artist
      const artistSongs = songsByArtist[artistId] || [];
      setSongs(artistSongs);
    }
    
    setIsLoading(false);
  }, [artistId, featuredArtists, songsByArtist]);

  return (
    <div>
      <Header />
      
      <div className="px-6 py-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : artist ? (
          <div>
            {/* Artist Header */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
              <div className="w-48 h-48 rounded-full overflow-hidden">
                <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-sm text-text-secondary">Artist</div>
                <h1 className="text-4xl font-bold mb-2">{artist.name}</h1>
                <div className="text-sm text-text-secondary">
                  {songs.length} {songs.length === 1 ? 'song' : 'songs'}
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            {songs.length > 0 && (
              <div className="flex items-center gap-4 mb-8">
                <button 
                  onClick={() => songs.length > 0 && playSong(songs[0])}
                  className="h-14 w-14 rounded-full bg-primary text-background-dark flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                >
                  <i className="ri-play-fill text-2xl"></i>
                </button>
                <button className="p-2 rounded-full bg-background-darker/50 text-text-secondary hover:text-text-primary transition-colors">
                  <i className="ri-heart-line text-lg"></i>
                </button>
                <button className="p-2 rounded-full bg-background-darker/50 text-text-secondary hover:text-text-primary transition-colors">
                  <i className="ri-more-fill text-lg"></i>
                </button>
              </div>
            )}
            
            {/* Songs List */}
            {songs.length > 0 ? (
              <section>
                <h2 className="text-xl font-semibold mb-4">Songs</h2>
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
                      {songs.map((song, index) => (
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
                <i className="ri-music-2-line text-5xl text-text-secondary mb-4"></i>
                <h3 className="text-xl font-semibold mb-2">No songs available</h3>
                <p className="text-text-secondary">
                  This artist doesn't have any songs in the library yet.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-background-card rounded-lg p-8 text-center">
            <i className="ri-user-line text-5xl text-text-secondary mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Artist not found</h3>
            <p className="text-text-secondary">
              The artist you're looking for doesn't exist.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}