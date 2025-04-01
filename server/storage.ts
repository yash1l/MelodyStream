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
    
    // Initialize with demo data
    this.initializeDemoData();
  }
  
  // Initialize demo data
  private initializeDemoData(): void {
    // Create demo artists
    const artists = [
      { name: "Taylor Swift", imageUrl: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=500&h=500&fit=crop&auto=format" },
      { name: "Drake", imageUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&h=500&fit=crop&auto=format" },
      { name: "Billie Eilish", imageUrl: "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=500&h=500&fit=crop&auto=format" },
      { name: "The Weeknd", imageUrl: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=500&h=500&fit=crop&auto=format" },
      { name: "Dua Lipa", imageUrl: "https://images.unsplash.com/photo-1496440737103-cd596325d314?w=500&h=500&fit=crop&auto=format" },
      { name: "Kendrick Lamar", imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&h=500&fit=crop&auto=format" }
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
        url: "/api/songs/1.mp3", 
        imageUrl: "https://images.unsplash.com/photo-1553524913-efba3f0b533e?w=500&h=500&fit=crop&auto=format" 
      },
      { 
        title: "Midnight City", 
        artist: "M83", 
        artistId: 2, 
        album: "Hurry Up, We're Dreaming", 
        duration: 243, 
        url: "/api/songs/2.mp3", 
        imageUrl: "https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?w=500&h=500&fit=crop&auto=format" 
      },
      { 
        title: "Blinding Lights", 
        artist: "The Weeknd", 
        artistId: 4, 
        album: "After Hours", 
        duration: 202, 
        url: "/api/songs/3.mp3", 
        imageUrl: "https://images.unsplash.com/photo-1561211957-7540a3deb471?w=500&h=500&fit=crop&auto=format" 
      },
      { 
        title: "Dreams", 
        artist: "Fleetwood Mac", 
        artistId: 3, 
        album: "Rumours", 
        duration: 254, 
        url: "/api/songs/4.mp3", 
        imageUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&h=500&fit=crop&auto=format" 
      },
      { 
        title: "Levitating", 
        artist: "Dua Lipa", 
        artistId: 5, 
        album: "Future Nostalgia", 
        duration: 203, 
        url: "/api/songs/5.mp3", 
        imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop&auto=format" 
      },
      { 
        title: "Starboy", 
        artist: "The Weeknd, Daft Punk", 
        artistId: 4, 
        album: "Starboy", 
        duration: 230, 
        url: "/api/songs/6.mp3", 
        imageUrl: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=500&h=500&fit=crop&auto=format" 
      }
    ];
    
    songs.forEach(song => {
      this.createSong(song);
    });
    
    // Create demo user
    this.createUser({ username: "demo", password: "password" });
    
    // Create demo playlists
    const playlists = [
      { name: "Workout Mix", userId: 1, imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop&auto=format" },
      { name: "Chill Vibes", userId: 1, imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop&auto=format" },
      { name: "Focus Beats", userId: 1, imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop&auto=format" }
    ];
    
    playlists.forEach(playlist => {
      this.createPlaylist(playlist);
    });
    
    // Add songs to playlists
    this.addSongToPlaylist(1, 1);
    this.addSongToPlaylist(1, 5);
    this.addSongToPlaylist(2, 2);
    this.addSongToPlaylist(2, 4);
    this.addSongToPlaylist(3, 1);
    this.addSongToPlaylist(3, 3);
    
    // Add liked songs
    this.addLikedSong(1, 3);
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
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
    const song: Song = { 
      ...insertSong, 
      id,
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
    const playlist: Playlist = { 
      ...insertPlaylist, 
      id,
      createdAt: new Date()
    };
    this.playlists.set(id, playlist);
    this.playlistSongs.set(id, new Set());
    return playlist;
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
    for (const songId of songSet) {
      const song = this.songs.get(songId);
      if (song) {
        songs.push(song);
      }
    }
    
    return songs;
  }
  
  // Liked songs methods
  async getLikedSongs(userId: number): Promise<Song[]> {
    const likedSet = this.likedSongs.get(userId);
    if (!likedSet) return [];
    
    const songs: Song[] = [];
    for (const songId of likedSet) {
      const song = this.songs.get(songId);
      if (song) {
        songs.push(song);
      }
    }
    
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
