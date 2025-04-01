import { useEffect, useState } from "react";
import Header from "@/components/Header";
import PlaylistCard from "@/components/PlaylistCard";
import SongCard from "@/components/SongCard";
import { useMusicContext } from "@/context/MusicContext";
import { useLocation } from "wouter";
import { Playlist, Song } from "@shared/schema";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Library() {
  const { playlists, likedSongs, createPlaylist } = useMusicContext();
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isCreatePlaylistDialogOpen, setIsCreatePlaylistDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [location] = useLocation();
  
  // Parse the query parameters to determine which playlist is selected
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const playlistId = params.get('playlist');
    
    if (playlistId === 'liked') {
      setSelectedPlaylist({ id: -1, name: 'Liked Songs', songs: likedSongs });
      setSongs(likedSongs);
    } else if (playlistId) {
      const playlist = playlists.find(p => p.id.toString() === playlistId);
      if (playlist) {
        setSelectedPlaylist(playlist);
        setSongs(playlist.songs || []);
      }
    } else {
      setSelectedPlaylist(null);
    }
  }, [location, playlists, likedSongs]);
  
  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
      setIsCreatePlaylistDialogOpen(false);
    }
  };
  
  return (
    <div>
      <Header />
      
      <div className="px-6 py-4">
        {selectedPlaylist ? (
          // Display selected playlist
          <section>
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setSelectedPlaylist(null)}
                className="p-2 rounded-full bg-background-darker text-text-secondary hover:text-text-primary transition-colors mr-4"
              >
                <i className="ri-arrow-left-s-line text-xl"></i>
              </button>
              <h2 className="text-2xl font-bold">{selectedPlaylist.name}</h2>
            </div>
            
            {/* Playlist Songs Table */}
            {songs.length > 0 ? (
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
            ) : (
              <div className="bg-background-card rounded-lg p-8 text-center">
                <i className="ri-music-2-line text-5xl text-text-secondary mb-4"></i>
                <h3 className="text-xl font-semibold mb-2">No songs yet</h3>
                <p className="text-text-secondary">
                  {selectedPlaylist.id === -1 
                    ? "Like some songs to add them here!" 
                    : "Add songs to this playlist to get started."}
                </p>
              </div>
            )}
          </section>
        ) : (
          // Display library with playlists
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Library</h2>
              <Button 
                onClick={() => setIsCreatePlaylistDialogOpen(true)}
                className="flex items-center px-4 py-2 rounded-full bg-primary hover:bg-primary/90 text-black font-medium text-sm"
              >
                <i className="ri-add-line mr-2"></i>
                <span>Create Playlist</span>
              </Button>
            </div>
            
            {/* Playlist Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 mb-10">
              {/* Liked Songs */}
              <PlaylistCard 
                playlist={{ id: -1, name: 'Liked Songs', songs: likedSongs }} 
                isLiked={true} 
              />
              
              {/* User Playlists */}
              {playlists.map(playlist => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          </section>
        )}
      </div>
      
      {/* Create Playlist Dialog */}
      <Dialog open={isCreatePlaylistDialogOpen} onOpenChange={setIsCreatePlaylistDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Playlist</DialogTitle>
            <DialogDescription>
              Give your playlist a name to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="My Awesome Playlist"
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatePlaylistDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePlaylist}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
