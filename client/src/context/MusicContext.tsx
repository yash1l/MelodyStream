import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Song, Playlist, Artist } from "@shared/schema";

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  volume: number;
  progress: number;
  duration: number;
  playlists: Playlist[];
  likedSongs: Song[];
  isLoaded: boolean;
  songsByArtist: Record<number, Song[]>;
  recentlyPlayed: Song[];
  topSongs: Song[];
  featuredArtists: Artist[];
  playSong: (song: Song, playlistSongs?: Song[]) => void;
  pauseSong: () => void;
  nextSong: () => void;
  prevSong: () => void;
  addToQueue: (song: Song) => void;
  clearQueue: () => void;
  setVolume: (value: number) => void;
  setProgress: (value: number) => void;
  toggleLike: (songId: number) => void;
  createPlaylist: (name: string) => Promise<void>;
  deletePlaylist: (playlistId: number) => Promise<void>;
  addToPlaylist: (songId: number, playlistId: number) => Promise<void>;
  removeFromPlaylist: (songId: number, playlistId: number) => Promise<void>;
  updatePlaylistOrder: (playlistId: number, songIds: number[]) => Promise<void>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [volume, setVolumeState] = useState(0.7);
  const [progress, setProgressState] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [songsByArtist, setSongsByArtist] = useState<Record<number, Song[]>>({});
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);
  const [topSongs, setTopSongs] = useState<Song[]>([]);
  const [featuredArtists, setFeaturedArtists] = useState<Artist[]>([]);

  // Initialize app data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch songs
        const songsResponse = await fetch('/api/songs');
        const songs = await songsResponse.json();
        
        // Fetch playlists
        const playlistsResponse = await fetch('/api/playlists');
        const playlistsData = await playlistsResponse.json();
        setPlaylists(playlistsData);
        
        // Fetch liked songs
        try {
          const likedResponse = await fetch('/api/liked');
          const likedData = await likedResponse.json();
          setLikedSongs(likedData.songs || []);
        } catch (error) {
          console.error("Failed to load liked songs:", error);
          // Fallback to old endpoint for backward compatibility
          try {
            const likedResponse = await fetch('/api/playlists/liked');
            const likedData = await likedResponse.json();
            setLikedSongs(likedData.songs || []);
          } catch (fallbackError) {
            console.error("Failed to load liked songs (fallback):", fallbackError);
            setLikedSongs([]);
          }
        }
        
        // Fetch artists
        const artistsResponse = await fetch('/api/artists');
        const artists = await artistsResponse.json();
        setFeaturedArtists(artists);
        
        // Group songs by artist
        const groupedSongs: Record<number, Song[]> = {};
        songs.forEach((song: Song) => {
          if (!groupedSongs[song.artistId]) {
            groupedSongs[song.artistId] = [];
          }
          groupedSongs[song.artistId].push(song);
        });
        setSongsByArtist(groupedSongs);
        
        // Set top songs and recently played
        setTopSongs(songs.slice(0, 5));
        setRecentlyPlayed(songs.slice(0, 6));
        
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    
    loadData();
  }, []);

  const playSong = (song: Song, playlistSongs?: Song[]) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setDuration(song.duration);
    
    // Add to recently played
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(s => s.id !== song.id);
      return [song, ...filtered].slice(0, 6);
    });
    
    // If the song is from a playlist, add the rest of the playlist to the queue
    if (playlistSongs && playlistSongs.length > 1) {
      // Find the current song's index in the playlist
      const songIndex = playlistSongs.findIndex(s => s.id === song.id);
      if (songIndex !== -1 && songIndex < playlistSongs.length - 1) {
        // Add all songs after the current one to the queue
        const songsToQueue = playlistSongs.slice(songIndex + 1);
        setQueue(songsToQueue);
      }
    }
  };

  const pauseSong = () => {
    setIsPlaying(false);
  };

  const nextSong = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      setCurrentSong(nextSong);
      setQueue(prev => prev.slice(1));
      setIsPlaying(true);
      setDuration(nextSong.duration);
      setProgress(0);
    }
  };

  const prevSong = () => {
    if (progress > 3) {
      // If more than 3 seconds into song, restart it
      setProgress(0);
    } else if (recentlyPlayed.length > 1) {
      // Play previous song
      const prevSong = recentlyPlayed[1];
      setCurrentSong(prevSong);
      setIsPlaying(true);
      setDuration(prevSong.duration);
      setProgress(0);
    }
  };

  const addToQueue = (song: Song) => {
    setQueue(prev => [...prev, song]);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const setVolume = (value: number) => {
    setVolumeState(value);
  };

  const setProgress = (value: number) => {
    setProgressState(value);
  };

  const toggleLike = async (songId: number) => {
    try {
      const isLiked = likedSongs.some(song => song.id === songId);
      
      if (isLiked) {
        await apiRequest('DELETE', `/api/liked/songs/${songId}`);
        setLikedSongs(prev => prev.filter(song => song.id !== songId));
      } else {
        await apiRequest('POST', `/api/liked/songs/${songId}`);
        
        // Find the song in our available songs
        const songToAdd = 
          currentSong?.id === songId ? currentSong : 
          recentlyPlayed.find(s => s.id === songId) || 
          topSongs.find(s => s.id === songId);
          
        if (songToAdd) {
          setLikedSongs(prev => [...prev, songToAdd]);
        }
      }
    } catch (error) {
      console.error("Failed to toggle like:", error);
      
      // Try with the legacy endpoints as fallback
      try {
        const isLiked = likedSongs.some(song => song.id === songId);
        
        if (isLiked) {
          await apiRequest('DELETE', `/api/playlists/liked/songs/${songId}`);
          setLikedSongs(prev => prev.filter(song => song.id !== songId));
        } else {
          await apiRequest('POST', `/api/playlists/liked/songs/${songId}`);
          
          // Find the song
          const songToAdd = 
            currentSong?.id === songId ? currentSong : 
            recentlyPlayed.find(s => s.id === songId) || 
            topSongs.find(s => s.id === songId);
            
          if (songToAdd) {
            setLikedSongs(prev => [...prev, songToAdd]);
          }
        }
      } catch (fallbackError) {
        console.error("Failed to toggle like (fallback):", fallbackError);
      }
    }
  };

  const createPlaylist = async (name: string) => {
    try {
      const response = await apiRequest('POST', '/api/playlists', { name });
      const newPlaylist = await response.json();
      setPlaylists(prev => [...prev, newPlaylist]);
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };

  const addToPlaylist = async (songId: number, playlistId: number) => {
    try {
      await apiRequest('POST', `/api/playlists/${playlistId}/songs/${songId}`);
      // Update playlist in state
      setPlaylists(prev => 
        prev.map(playlist => {
          if (playlist.id === playlistId) {
            // Find the song to add
            const songToAdd = 
              currentSong?.id === songId ? currentSong : 
              recentlyPlayed.find(s => s.id === songId) || 
              topSongs.find(s => s.id === songId);
              
            if (songToAdd && playlist.songs) {
              return {
                ...playlist,
                songs: [...playlist.songs, songToAdd]
              };
            }
          }
          return playlist;
        })
      );
    } catch (error) {
      console.error("Failed to add song to playlist:", error);
    }
  };

  const removeFromPlaylist = async (songId: number, playlistId: number) => {
    try {
      await apiRequest('DELETE', `/api/playlists/${playlistId}/songs/${songId}`);
      // Update playlist in state
      setPlaylists(prev => 
        prev.map(playlist => {
          if (playlist.id === playlistId && playlist.songs) {
            return {
              ...playlist,
              songs: playlist.songs.filter(song => song.id !== songId)
            };
          }
          return playlist;
        })
      );
    } catch (error) {
      console.error("Failed to remove song from playlist:", error);
    }
  };

  const deletePlaylist = async (playlistId: number) => {
    try {
      await apiRequest('DELETE', `/api/playlists/${playlistId}`);
      // Remove playlist from state
      setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
    } catch (error) {
      console.error("Failed to delete playlist:", error);
    }
  };
  
  const updatePlaylistOrder = async (playlistId: number, songIds: number[]) => {
    try {
      // API call to update order would go here in a real implementation
      // For now, we'll just update the state to simulate the change
      await apiRequest('PATCH', `/api/playlists/${playlistId}/order`, { songIds });
      
      // Update playlist in state with the new order
      setPlaylists(prev => 
        prev.map(playlist => {
          if (playlist.id === playlistId && playlist.songs) {
            // Create a map of songs by ID for quick lookup
            const songsMap = new Map(playlist.songs.map(song => [song.id, song]));
            
            // Create a new array of songs in the correct order
            const orderedSongs = songIds
              .map(id => songsMap.get(id))
              .filter(song => song !== undefined) as Song[];
            
            return {
              ...playlist,
              songs: orderedSongs
            };
          }
          return playlist;
        })
      );
    } catch (error) {
      console.error("Failed to update playlist order:", error);
    }
  };

  const value = {
    currentSong,
    isPlaying,
    queue,
    volume,
    progress,
    duration,
    playlists,
    likedSongs,
    isLoaded,
    songsByArtist,
    recentlyPlayed,
    topSongs,
    featuredArtists,
    playSong,
    pauseSong,
    nextSong,
    prevSong,
    addToQueue,
    clearQueue,
    setVolume,
    setProgress,
    toggleLike,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    updatePlaylistOrder
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
};
