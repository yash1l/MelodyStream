import { 
  User, InsertUser, 
  Song, InsertSong,
  Playlist, InsertPlaylist,
  Artist, InsertArtist,
  LikedSong, InsertLikedSong
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Song methods
  getSong(id: number): Promise<Song | undefined>;
  getAllSongs(): Promise<Song[]>;
  createSong(song: InsertSong): Promise<Song>;
  
  // Playlist methods
  getPlaylist(id: number): Promise<Playlist | undefined>;
  getUserPlaylists(userId: number): Promise<Playlist[]>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  deletePlaylist(id: number): Promise<void>;
  addSongToPlaylist(playlistId: number, songId: number): Promise<void>;
  removeSongFromPlaylist(playlistId: number, songId: number): Promise<void>;
  getPlaylistSongs(playlistId: number): Promise<Song[]>;
  
  // Liked songs methods
  getLikedSongs(userId: number): Promise<Song[]>;
  addLikedSong(userId: number, songId: number): Promise<void>;
  removeLikedSong(userId: number, songId: number): Promise<void>;
  
  // Artist methods
  getArtist(id: number): Promise<Artist | undefined>;
  getAllArtists(): Promise<Artist[]>;
  createArtist(artist: InsertArtist): Promise<Artist>;
  getArtistSongs(artistId: number): Promise<Song[]>;
}

// Format seconds to MM:SS
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private songs: Map<number, Song>;
  private playlists: Map<number, Playlist>;
  private artists: Map<number, Artist>;
  private playlistSongs: Map<number, Set<number>>;
  private likedSongs: Map<number, Set<number>>;
  
  private userId: number;
  private songId: number;
  private playlistId: number;
  private artistId: number;
  
  constructor() {
    this.users = new Map();
    this.songs = new Map();
    this.playlists = new Map();
    this.artists = new Map();
    this.playlistSongs = new Map();
    this.likedSongs = new Map();
    
    this.userId = 1;
    this.songId = 1;
    this.playlistId = 1;
    this.artistId = 1;
    
    this.initializeDemoData();
  }
  
  private initializeDemoData(): void {
    // Create demo artists
    const artists = [
      { name: "ODESZA", imageUrl: "/images/artists/odesza.jpg" },
      { name: "M83", imageUrl: "/images/artists/m83.jpg" },
      { name: "Fleetwood Mac", imageUrl: "/images/artists/fleetwood-mac.jpg" },
      { name: "The Weeknd", imageUrl: "/images/artists/weeknd.jpg" },
      { name: "Dua Lipa", imageUrl: "/images/artists/dua-lipa.jpg" },
      { name: "Kendrick Lamar", imageUrl: "/images/artists/kendrick-lamar.jpg" }
    ];
    
    artists.forEach(artist => {
      this.createArtist({ name: artist.name, imageUrl: artist.imageUrl });
    });
    
    // Create demo songs
    const songs = [
      { 
        title: "Higher Ground", 
        artist: "ODESZA", 
        artistId: 1, 
        album: "A Moment Apart", 
        duration: 227, 
        url: "/songs/higher-ground.mp3",
        imageUrl: "/images/albums/higher-ground.jpg"
      },
      { 
        title: "Midnight City", 
        artist: "M83", 
        artistId: 2, 
        album: "Hurry Up, We're Dreaming", 
        duration: 243, 
        url: "/songs/midnight-city.mp3",
        imageUrl: "/images/albums/midnight-city.jpg"
      },
      { 
        title: "Dreams", 
        artist: "Fleetwood Mac", 
        artistId: 3, 
        album: "Rumours", 
        duration: 254, 
        url: "/songs/dreams.mp3",
        imageUrl: "/images/albums/dreams.jpg"
      },
      { 
        title: "Blinding Lights", 
        artist: "The Weeknd", 
        artistId: 4, 
        album: "After Hours", 
        duration: 202, 
        url: "/songs/blinding-lights.mp3",
        imageUrl: "/images/albums/blinding-lights.jpg"
      },
      { 
        title: "Levitating", 
        artist: "Dua Lipa", 
        artistId: 5, 
        album: "Future Nostalgia", 
        duration: 203, 
        url: "/songs/levitating.mp3",
        imageUrl: "/images/albums/levitating.jpg"
      },
      { 
        title: "Starboy", 
        artist: "The Weeknd", 
        artistId: 4, 
        album: "Starboy", 
        duration: 230, 
        url: "/songs/starboy.mp3",
        imageUrl: "/images/albums/starboy.jpg"
      }
    ];
    
    songs.forEach(song => {
      this.createSong(song);
    });
    
    // Create demo user
    this.createUser({ username: "demo", password: "password" });
    
    // Create demo playlists
    const playlists = [
      { 
        name: "Workout Mix", 
        userId: 1, 
        imageUrl: "/images/playlists/workout.jpg"
      },
      { 
        name: "Chill Vibes", 
        userId: 1, 
        imageUrl: "/images/playlists/chill.jpg"
      },
      { 
        name: "Focus Beats", 
        userId: 1, 
        imageUrl: "/images/playlists/focus.jpg"
      }
    ];
    
    playlists.forEach(playlist => {
      this.createPlaylist(playlist);
    });
    
    // Add songs to playlists
    this.addSongToPlaylist(1, 1); // Higher Ground to Workout Mix
    this.addSongToPlaylist(1, 5); // Levitating to Workout Mix
    this.addSongToPlaylist(2, 2); // Midnight City to Chill Vibes
    this.addSongToPlaylist(2, 3); // Dreams to Chill Vibes
    this.addSongToPlaylist(3, 4); // Blinding Lights to Focus Beats
    this.addSongToPlaylist(3, 6); // Starboy to Focus Beats
    
    // Add some liked songs
    this.addLikedSong(1, 3); // Dreams
    this.addLikedSong(1, 4); // Blinding Lights
  }

(3, 3);
    
    // Add liked songs
    this.addLikedSong(1, 3);
  }
  
users.set(id, user);
    this.likedSongs.set(id, new Set());
    return user;
  }
  
  // Song methods
  async getSong(id: number): Promise<Song | undefined> {
    return this.songs.get(id);
  }
  
  async getAllSongs(): Promise<Song[]> {
    return Array.from(this.songs.values());
  }
  
  async createSong(insertSong: InsertSong): Promise<Song> {
    const id = this.songId++;
    // Ensure album is set to null if undefined
    const album = insertSong.album === undefined ? null : insertSong.album;
    
    const song: Song = { 
      ...insertSong, 
      id,
      album,
      createdAt: new Date(),
      durationFormatted: formatDuration(insertSong.duration)
    };
    this.songs.set(id, song);
    return song;
  }
  
  // Playlist methods
  async getPlaylist(id: number): Promise<Playlist | undefined> {
    const playlist = this.playlists.get(id);
    if (!playlist) return undefined;
    
    const songs = await this.getPlaylistSongs(id);
    return { ...playlist, songs };
  }
  
  async getUserPlaylists(userId: number): Promise<Playlist[]> {
    const userPlaylists = Array.from(this.playlists.values()).filter(
      (playlist) => playlist.userId === userId,
    );
    
    // Populate songs for each playlist
    for (const playlist of userPlaylists) {
      playlist.songs = await this.getPlaylistSongs(playlist.id);
    }
    
    return userPlaylists;
  }
  
  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const id = this.playlistId++;
    // Ensure imageUrl is set to null if undefined
    const imageUrl = insertPlaylist.imageUrl === undefined ? null : insertPlaylist.imageUrl;
    
    const playlist: Playlist = { 
      ...insertPlaylist, 
      id,
      imageUrl,
      createdAt: new Date()
    };
    this.playlists.set(id, playlist);
    this.playlistSongs.set(id, new Set());
    return playlist;
  }
  
  async deletePlaylist(id: number): Promise<void> {
    // Remove the playlist
    this.playlists.delete(id);
    
    // Remove all songs from the playlist
    this.playlistSongs.delete(id);
  }
  
  async addSongToPlaylist(playlistId: number, songId: number): Promise<void> {
    const songSet = this.playlistSongs.get(playlistId);
    if (songSet) {
      songSet.add(songId);
    }
  }
  
  async removeSongFromPlaylist(playlistId: number, songId: number): Promise<void> {
    const songSet = this.playlistSongs.get(playlistId);
    if (songSet) {
      songSet.delete(songId);
    }
  }
  
  async getPlaylistSongs(playlistId: number): Promise<Song[]> {
    const songSet = this.playlistSongs.get(playlistId);
    if (!songSet) return [];
    
    const songs: Song[] = [];
    // Use Array.from to convert Set to array for iteration
    Array.from(songSet).forEach(songId => {
      const song = this.songs.get(songId);
      if (song) {
        songs.push(song);
      }
    });
    
    return songs;
  }
  
  // Liked songs methods
  async getLikedSongs(userId: number): Promise<Song[]> {
    const likedSet = this.likedSongs.get(userId);
    if (!likedSet) return [];
    
    const songs: Song[] = [];
    // Use Array.from to convert Set to array for iteration
    Array.from(likedSet).forEach(songId => {
      const song = this.songs.get(songId);
      if (song) {
        songs.push(song);
      }
    });
    
    return songs;
  }
  
  async addLikedSong(userId: number, songId: number): Promise<void> {
    const likedSet = this.likedSongs.get(userId);
    if (likedSet) {
      likedSet.add(songId);
    }
  }
  
  async removeLikedSong(userId: number, songId: number): Promise<void> {
    const likedSet = this.likedSongs.get(userId);
    if (likedSet) {
      likedSet.delete(songId);
    }
  }
  
  // Artist methods
  async getArtist(id: number): Promise<Artist | undefined> {
    return this.artists.get(id);
  }
  
  async getAllArtists(): Promise<Artist[]> {
    return Array.from(this.artists.values());
  }
  
  async createArtist(insertArtist: InsertArtist): Promise<Artist> {
    const id = this.artistId++;
    const artist: Artist = { 
      ...insertArtist, 
      id,
      createdAt: new Date()
    };
    this.artists.set(id, artist);
    return artist;
  }
  
  async getArtistSongs(artistId: number): Promise<Song[]> {
    return Array.from(this.songs.values()).filter(
      (song) => song.artistId === artistId,
    );
  }
}

export const storage = new MemStorage();
