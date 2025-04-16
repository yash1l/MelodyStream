import { useMusicContext } from "@/context/MusicContext";
import { useState, useEffect, useRef } from "react";

export default function MiniPlayer() {
  const { 
    currentSong, 
    isPlaying, 
    volume, 
    progress,
    duration, 
    playSong, 
    pauseSong, 
    nextSong, 
    prevSong, 
    setVolume,
    setProgress,
    toggleLike,
    likedSongs,
    queue
  } = useMusicContext();
  
  const [showQueue, setShowQueue] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeSliderRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    
    const updateProgress = () => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
      }
    };
    
    const interval = setInterval(updateProgress, 1000);
    
    return () => {
      clearInterval(interval);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Handle song changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (currentSong) {
      // Fix URL construction for audio source
      const audioUrl = currentSong.url || `/api/songs/${currentSong.id}.mp3`;
      audioRef.current.src = audioUrl;
      
      if (isPlaying) {
        audioRef.current.play()
          .catch(error => {
            console.error("Error playing audio:", error);
            // Try alternative URL if initial URL fails
            if (currentSong.url && audioRef.current) {
              audioRef.current.src = `/api/songs/${currentSong.id}.mp3`;
              audioRef.current.play().catch(error => console.error("Error playing audio with fallback:", error));
            }
          });
      }
    }
  }, [currentSong]);
  
  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(error => console.error("Error playing audio:", error));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);
  
  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Handle seeking
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    
    // Only update if the difference is significant (to avoid feedback loops)
    if (Math.abs(audioRef.current.currentTime - progress) > 1) {
      audioRef.current.currentTime = progress;
    }
  }, [progress]);
  
  // Handle end of track
  useEffect(() => {
    if (!audioRef.current) return;
    
    const handleEnded = () => {
      nextSong();
    };
    
    audioRef.current.addEventListener("ended", handleEnded);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, [nextSong]);
  
  // Format time (seconds) to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !currentSong) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentClicked = clickPosition / rect.width;
    const newProgress = percentClicked * duration;
    
    setProgress(newProgress);
  };
  
  // Handle volume slider click
  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeSliderRef.current) return;
    
    const rect = volumeSliderRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, clickPosition / rect.width));
    
    setVolume(newVolume);
  };
  
  // Calculate progress percentage
  const progressPercentage = currentSong ? (progress / duration) * 100 : 0;
  
  // Check if current song is liked
  const isLiked = currentSong ? likedSongs.some(song => song.id === currentSong.id) : false;
  
  if (!currentSong) {
    return null;
  }
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-20 bg-background-darker border-t border-accent z-30 px-4">
      <div className="max-w-screen-2xl mx-auto h-full flex items-center justify-between">
        {/* Currently Playing */}
        <div className="flex items-center w-1/4">
          <div className="h-12 w-12 rounded bg-background-lighter overflow-hidden mr-3">
            <img src={currentSong.imageUrl} alt="Now playing" className="w-full h-full object-cover" />
          </div>
          <div className="mr-4 hidden sm:block">
            <h4 className="font-medium text-sm">{currentSong.title}</h4>
            <p className="text-xs text-text-secondary">{currentSong.artist}</p>
          </div>
          <button 
            onClick={() => currentSong && toggleLike(currentSong.id)} 
            className={`${isLiked ? 'text-primary' : 'text-text-secondary hover:text-primary'} hidden md:block`}
          >
            <i className={`${isLiked ? 'ri-heart-fill' : 'ri-heart-line'} text-lg`}></i>
          </button>
        </div>
        
        {/* Player Controls */}
        <div className="flex flex-col justify-center items-center w-2/4">
          <div className="flex items-center justify-center mb-1">
            <button className="mx-2 text-text-secondary hover:text-text-primary p-2 hidden sm:block">
              <i className="ri-shuffle-line text-lg"></i>
            </button>
            <button onClick={prevSong} className="mx-2 text-text-secondary hover:text-text-primary p-2">
              <i className="ri-skip-back-fill text-lg"></i>
            </button>
            <button 
              onClick={isPlaying ? pauseSong : () => currentSong && playSong(currentSong)} 
              className="mx-2 h-9 w-9 bg-text-primary text-background-dark rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              <i className={`${isPlaying ? 'ri-pause-fill' : 'ri-play-fill'} text-xl`}></i>
            </button>
            <button onClick={nextSong} className="mx-2 text-text-secondary hover:text-text-primary p-2">
              <i className="ri-skip-forward-fill text-lg"></i>
            </button>
            <button className="mx-2 text-text-secondary hover:text-text-primary p-2 hidden sm:block">
              <i className="ri-repeat-line text-lg"></i>
            </button>
          </div>
          
          <div className="w-full max-w-md flex items-center justify-center">
            <span className="text-xs text-text-secondary mr-2 hidden sm:block">{formatTime(progress)}</span>
            <div 
              ref={progressBarRef}
              onClick={handleProgressClick}
              className="progress-bar h-1 bg-accent flex-1 rounded-full relative cursor-pointer"
            >
              <div 
                className="h-full bg-primary rounded-full relative" 
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="progress-handle absolute right-0 top-1/2 transform -translate-y-1/2 h-3 w-3 bg-text-primary rounded-full opacity-0"></div>
              </div>
            </div>
            <span className="text-xs text-text-secondary ml-2 hidden sm:block">{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Volume & Queue */}
        <div className="flex items-center justify-end w-1/4">
          <button className="text-text-secondary hover:text-text-primary p-2 hidden lg:block">
            <i className="ri-mic-line text-lg"></i>
          </button>
          <button 
            onClick={() => setShowQueue(!showQueue)} 
            className="text-text-secondary hover:text-text-primary p-2 hidden lg:block"
          >
            <i className="ri-list-check text-lg"></i>
          </button>
          <button className="text-text-secondary hover:text-text-primary p-2 hidden md:block">
            <i className="ri-computer-line text-lg"></i>
          </button>
          
          <div className="hidden md:flex items-center">
            <button className="text-text-secondary hover:text-text-primary p-2">
              <i className="ri-volume-up-line text-lg"></i>
            </button>
            <div 
              ref={volumeSliderRef}
              onClick={handleVolumeClick}
              className="volume-slider w-24 h-1 bg-accent rounded-full relative cursor-pointer"
            >
              <div 
                className="h-full bg-text-secondary rounded-full relative" 
                style={{ width: `${volume * 100}%` }}
              >
                <div className="volume-handle absolute right-0 top-1/2 transform -translate-y-1/2 h-3 w-3 bg-text-primary rounded-full opacity-0"></div>
              </div>
            </div>
          </div>
          
          <button className="text-text-secondary hover:text-text-primary p-2 ml-2">
            <i className="ri-fullscreen-line text-lg"></i>
          </button>
        </div>
      </div>
      
      {/* Queue Panel (conditionally rendered) */}
      {showQueue && (
        <div className="absolute bottom-20 right-0 w-72 bg-background-darker border border-accent rounded-t-md shadow-lg p-4">
          <h3 className="text-lg font-bold mb-2">Queue</h3>
          <ul className="max-h-96 overflow-y-auto">
            {/* Now Playing */}
            {currentSong && (
              <li className="py-2 border-b border-accent/20">
                <div className="text-sm font-medium">Now Playing</div>
                <div className="flex items-center mt-1">
                  <div className="w-10 h-10 mr-3 bg-background-lighter rounded">
                    <img src={currentSong.imageUrl} alt={currentSong.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm">{currentSong.title}</div>
                    <div className="text-xs text-text-secondary">{currentSong.artist}</div>
                  </div>
                </div>
              </li>
            )}
            
            {/* Queue items */}
            {queue.length > 0 ? (
              <>
                <div className="text-sm font-medium mt-3 mb-1">Next in Queue</div>
                {queue.map((song, index) => (
                  <li key={`${song.id}-${index}`} className="py-2 border-b border-accent/10 last:border-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 mr-3 bg-background-lighter rounded">
                        {song.imageUrl ? (
                          <img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-background-lighter">
                            <i className="ri-music-2-line text-text-secondary"></i>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm">{song.title}</div>
                        <div className="text-xs text-text-secondary">{song.artist}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </>
            ) : (
              <div className="py-4 text-center text-text-secondary">
                <i className="ri-music-2-line text-2xl mb-2"></i>
                <p className="text-sm">Your queue is empty</p>
              </div>
            )}
          </ul>
        </div>
      )}
    </footer>
  );
}
