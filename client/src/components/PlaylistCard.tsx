import { useMusicContext } from "@/context/MusicContext";
import { Playlist } from "@shared/schema";
import { useLocation } from "wouter";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PlaylistCardProps {
  playlist: Playlist;
  isLiked?: boolean;
}

export default function PlaylistCard({ playlist, isLiked = false }: PlaylistCardProps) {
  const { playSong, deletePlaylist } = useMusicContext();
  const [, setLocation] = useLocation();
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (playlist.songs && playlist.songs.length > 0) {
      // Pass the entire playlist songs array to enable continuous playback
      playSong(playlist.songs[0], playlist.songs);
    }
  };
  
  const handleOpenPlaylist = () => {
    if (isLiked) {
      setLocation("/library?playlist=liked");
    } else {
      setLocation(`/library?playlist=${playlist.id}`);
    }
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeletePlaylist = async () => {
    try {
      await deletePlaylist(playlist.id);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete playlist:", error);
    }
  };
  
  // Get song count
  const songCount = playlist.songs?.length || 0;
  
  if (isLiked) {
    return (
      <div 
        className="block bg-gradient-to-br from-indigo-800 to-indigo-500 p-4 rounded-lg cursor-pointer hover:shadow-lg transition-all relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleOpenPlaylist}
      >
        <div className="mb-5 pt-2">
          <div className="grid grid-cols-3 gap-px">
            {/* Mock grid of song previews */}
            <div className="h-8 rounded-sm bg-white/20"></div>
            <div className="h-8 rounded-sm bg-white/10"></div>
            <div className="h-8 rounded-sm bg-white/30"></div>
            <div className="h-8 rounded-sm bg-white/10"></div>
            <div className="h-8 rounded-sm bg-white/30"></div>
            <div className="h-8 rounded-sm bg-white/20"></div>
          </div>
        </div>
        <h3 className="text-lg font-bold">Liked Songs</h3>
        <p className="text-sm text-text-secondary">{songCount} songs</p>
        
        {/* Always visible play button, larger on hover */}
        <div className="absolute bottom-4 right-4">
          <button 
            onClick={handlePlayClick}
            className={`rounded-full bg-primary flex items-center justify-center shadow-lg transition-all ${isHovered ? 'h-14 w-14 scale-105' : 'h-12 w-12'}`}
          >
            <i className="ri-play-fill text-2xl"></i>
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="block bg-background-card p-4 rounded-lg cursor-pointer hover:bg-background-card/80 transition-all relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleOpenPlaylist}
    >
      <div className="aspect-square mb-3 bg-background-lighter rounded-md overflow-hidden relative">
        {playlist.imageUrl ? (
          <img src={playlist.imageUrl} alt={playlist.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-background-lighter flex items-center justify-center">
            <i className="ri-music-2-line text-4xl text-text-secondary"></i>
          </div>
        )}
        
        {/* Play button overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
            <button 
              onClick={handlePlayClick}
              className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            >
              <i className="ri-play-fill text-2xl"></i>
            </button>
          </div>
        )}
      </div>
      <h3 className="text-base font-semibold">{playlist.name}</h3>
      <p className="text-sm text-text-secondary">Playlist • {songCount} songs</p>
      
      {/* Bottom-right action buttons */}
      <div className={`absolute bottom-4 right-4 flex items-center gap-2 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        {/* Delete button (not for liked songs) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="h-8 w-8 rounded-full bg-background-darker/70 flex items-center justify-center hover:bg-background-darker transition-colors"
            >
              <i className="ri-more-fill text-sm"></i>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={handleOpenPlaylist}>
              <i className="ri-music-list-line mr-2"></i>
              View playlist
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLocation(`/library?playlist=${playlist.id}&edit=true`)}>
              <i className="ri-list-order-line mr-2"></i>
              Edit sequence
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDeleteClick} className="text-destructive">
              <i className="ri-delete-bin-line mr-2"></i>
              Delete playlist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Play button */}
        <button 
          onClick={handlePlayClick}
          className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <i className="ri-play-fill text-xl"></i>
        </button>
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Playlist</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{playlist.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePlaylist} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
