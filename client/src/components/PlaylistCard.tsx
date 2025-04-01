import { useMusicContext } from "@/context/MusicContext";
import { Playlist } from "@shared/schema";
import { Link } from "wouter";

interface PlaylistCardProps {
  playlist: Playlist;
  isLiked?: boolean;
}

export default function PlaylistCard({ playlist, isLiked = false }: PlaylistCardProps) {
  const { playSong } = useMusicContext();
  
  const handlePlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (playlist.songs && playlist.songs.length > 0) {
      playSong(playlist.songs[0]);
    }
  };
  
  // Get song count
  const songCount = playlist.songs?.length || 0;
  
  if (isLiked) {
    return (
      <Link href="/library?playlist=liked">
        <a className="bg-gradient-to-br from-indigo-800 to-indigo-500 p-4 rounded-lg cursor-pointer hover:shadow-lg transition-all">
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
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handlePlayClick}
              className="h-12 w-12 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            >
              <i className="ri-play-fill text-2xl"></i>
            </button>
          </div>
        </a>
      </Link>
    );
  }
  
  return (
    <Link href={`/library?playlist=${playlist.id}`}>
      <a className="bg-background-card p-4 rounded-lg cursor-pointer hover:bg-background-card/80 transition-all">
        <div className="aspect-square mb-3 bg-background-lighter rounded-md overflow-hidden">
          {playlist.imageUrl ? (
            <img src={playlist.imageUrl} alt={playlist.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-background-lighter flex items-center justify-center">
              <i className="ri-music-2-line text-4xl text-text-secondary"></i>
            </div>
          )}
        </div>
        <h3 className="text-base font-semibold">{playlist.name}</h3>
        <p className="text-sm text-text-secondary">Playlist • {songCount} songs</p>
        
        <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handlePlayClick}
            className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          >
            <i className="ri-play-fill text-xl"></i>
          </button>
        </div>
      </a>
    </Link>
  );
}
