import { useMusicContext } from "@/context/MusicContext";
import { Song } from "@shared/schema";
import { useState } from "react";
import { useLocation } from "wouter";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
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

interface SongCardProps {
  song: Song;
  index?: number;
  showIndex?: boolean;
  layout?: 'grid' | 'list';
}

export default function SongCard({ song, index, showIndex = false, layout = 'grid' }: SongCardProps) {
  const { 
    playSong, 
    likedSongs, 
    toggleLike, 
    addToQueue, 
    playlists, 
    addToPlaylist,
    createPlaylist,
    currentSong
  } = useMusicContext();
  
  const [, navigate] = useLocation();
  
  const [isCreatePlaylistDialogOpen, setIsCreatePlaylistDialogOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  
  const isLiked = likedSongs.some(s => s.id === song.id);
  const isPlaying = currentSong?.id === song.id;

  const handleCreatePlaylist = async () => {
    if (newPlaylistName.trim()) {
      await createPlaylist(newPlaylistName.trim());
      
      // Get the latest playlist (the one we just created)
      const latestPlaylist = playlists[playlists.length - 1];
      if (latestPlaylist) {
        await addToPlaylist(song.id, latestPlaylist.id);
      }
      
      setNewPlaylistName("");
      setIsCreatePlaylistDialogOpen(false);
    }
  };

  if (layout === 'list') {
    return (
      <>
        <tr className="border-b border-accent/10 hover:bg-background-lighter/50 group">
          <td className="p-4 text-text-secondary">{showIndex ? index : ''}</td>
          <td className="p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 min-w-[40px] bg-background-lighter rounded overflow-hidden mr-3 relative group">
                <img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Play the song (context will handle continuity)
                      playSong(song);
                    }}>
                  <i className="ri-play-fill text-xl text-white"></i>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-text-primary">{song.title}</h4>
                <p 
                  className="text-sm text-text-secondary hover:text-primary cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/artist?id=${song.artistId}`);
                  }}
                >
                  {song.artist}
                </p>
              </div>
              <div className="ml-auto md:hidden flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      <i className="ri-more-fill text-xl"></i>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => playSong(song)}>
                      <i className="ri-play-fill mr-2"></i> Play
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleLike(song.id)}>
                      <i className={`${isLiked ? 'ri-heart-fill text-primary' : 'ri-heart-line'} mr-2`}></i> 
                      {isLiked ? 'Remove from Liked' : 'Add to Liked'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addToQueue(song)}>
                      <i className="ri-add-line mr-2"></i> Add to Queue
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <i className="ri-add-line mr-2"></i> Add to playlist
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent>
                        {playlists.length > 0 ? (
                          playlists.map(playlist => (
                            <DropdownMenuItem key={playlist.id} onClick={() => addToPlaylist(song.id, playlist.id)}>
                              {playlist.name}
                            </DropdownMenuItem>
                          ))
                        ) : (
                          <DropdownMenuItem disabled>No playlists</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setIsCreatePlaylistDialogOpen(true)}>
                          <i className="ri-add-circle-line mr-2"></i> Create new playlist
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </td>
          <td className="p-4 text-text-secondary hidden md:table-cell">{song.album}</td>
          <td className="p-4 text-text-secondary text-right hidden md:table-cell">
            <div className="flex items-center justify-end">
              <button 
                onClick={() => toggleLike(song.id)} 
                className={`p-2 ${isLiked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity hover:text-primary`}
              >
                <i className={`${isLiked ? 'ri-heart-fill text-primary' : 'ri-heart-line'}`}></i>
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity p-2">
                    <i className="ri-more-fill text-lg"></i>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => playSong(song)}>
                    <i className="ri-play-fill mr-2"></i> Play
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => addToQueue(song)}>
                    <i className="ri-add-line mr-2"></i> Add to Queue
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <i className="ri-add-line mr-2"></i> Add to playlist
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {playlists.length > 0 ? (
                        playlists.map(playlist => (
                          <DropdownMenuItem key={playlist.id} onClick={() => addToPlaylist(song.id, playlist.id)}>
                            {playlist.name}
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <DropdownMenuItem disabled>No playlists</DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setIsCreatePlaylistDialogOpen(true)}>
                        <i className="ri-add-circle-line mr-2"></i> Create new playlist
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="ml-2">{song.durationFormatted}</span>
            </div>
          </td>
        </tr>

        {/* Create Playlist Dialog */}
        <Dialog open={isCreatePlaylistDialogOpen} onOpenChange={setIsCreatePlaylistDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
              <DialogDescription>
                Create a new playlist with "{song.title}"
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
      </>
    );
  }

  return (
    <>
      <div className="song-card-container bg-background-card p-4 rounded-lg cursor-pointer hover:bg-background-card/80 transition-all relative group">
        <div className="aspect-square mb-3 bg-background-lighter rounded-md overflow-hidden relative">
          <img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover" />
          
          <div 
            className="song-card-overlay absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 transform translate-y-2 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              // Use the context's data to play the song with proper continuity
              playSong(song);
            }}
          >
            <button className="h-12 w-12 rounded-full bg-primary text-black flex items-center justify-center shadow-lg">
              <i className={`${isPlaying ? 'ri-pause-fill' : 'ri-play-fill'} text-2xl`}></i>
            </button>
          </div>
          
          <div className={`absolute top-2 right-2 ${isLiked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(song.id);
              }} 
              className="p-2 rounded-full bg-background-dark/80 text-white hover:text-primary"
            >
              <i className={`${isLiked ? 'ri-heart-fill text-primary' : 'ri-heart-line'} text-lg`}></i>
            </button>
          </div>
        </div>
        <h3 className="text-base font-semibold truncate">{song.title}</h3>
        <p 
          className="text-sm text-text-secondary hover:text-primary cursor-pointer transition-colors truncate"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/artist?id=${song.artistId}`);
          }}
        >
          {song.artist}
        </p>
        
        {/* Hidden context menu */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 rounded-full bg-background-dark/80 text-white hover:text-primary">
                <i className="ri-more-fill text-lg"></i>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => playSong(song)}>
                <i className="ri-play-fill mr-2"></i> Play
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleLike(song.id)}>
                <i className={`${isLiked ? 'ri-heart-fill' : 'ri-heart-line'} mr-2`}></i> 
                {isLiked ? 'Remove from Liked' : 'Add to Liked'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addToQueue(song)}>
                <i className="ri-add-line mr-2"></i> Add to Queue
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <i className="ri-add-line mr-2"></i> Add to playlist
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {playlists.length > 0 ? (
                    playlists.map(playlist => (
                      <DropdownMenuItem key={playlist.id} onClick={() => addToPlaylist(song.id, playlist.id)}>
                        {playlist.name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>No playlists</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsCreatePlaylistDialogOpen(true)}>
                    <i className="ri-add-circle-line mr-2"></i> Create new playlist
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Create Playlist Dialog */}
      <Dialog open={isCreatePlaylistDialogOpen} onOpenChange={setIsCreatePlaylistDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Playlist</DialogTitle>
            <DialogDescription>
              Create a new playlist with "{song.title}"
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
    </>
  );
}
