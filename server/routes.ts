import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSongSchema, insertPlaylistSchema, insertArtistSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Songs endpoints
  app.get("/api/songs", async (req, res) => {
    const songs = await storage.getAllSongs();
    res.json(songs);
  });
  
  app.get("/api/songs/:id", async (req, res) => {
    const songId = parseInt(req.params.id);
    if (isNaN(songId)) {
      return res.status(400).json({ message: "Invalid song ID" });
    }
    
    const song = await storage.getSong(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    
    res.json(song);
  });
  
  app.post("/api/songs", async (req, res) => {
    try {
      const songData = insertSongSchema.parse(req.body);
      const song = await storage.createSong(songData);
      res.status(201).json(song);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid song data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create song" });
    }
  });
  
  // Playlists endpoints
  app.get("/api/playlists", async (req, res) => {
    // For demo purposes, get playlists for user ID 1
    const userId = 1;
    const playlists = await storage.getUserPlaylists(userId);
    res.json(playlists);
  });
  
  app.get("/api/playlists/:id", async (req, res) => {
    const playlistId = parseInt(req.params.id);
    if (isNaN(playlistId)) {
      return res.status(400).json({ message: "Invalid playlist ID" });
    }
    
    const playlist = await storage.getPlaylist(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    
    res.json(playlist);
  });
  
  app.post("/api/playlists", async (req, res) => {
    try {
      // For demo purposes, use user ID 1
      const userId = 1;
      const { name } = req.body;
      
      if (!name || typeof name !== 'string') {
        return res.status(400).json({ message: "Invalid playlist name" });
      }
      
      const playlistData = {
        name,
        userId,
        imageUrl: null // Use null for generated playlists
      };
      
      const playlist = await storage.createPlaylist(playlistData);
      res.status(201).json(playlist);
    } catch (error) {
      res.status(500).json({ message: "Failed to create playlist" });
    }
  });
  
  // Playlist songs endpoints
  app.post("/api/playlists/:playlistId/songs/:songId", async (req, res) => {
    const playlistId = parseInt(req.params.playlistId);
    const songId = parseInt(req.params.songId);
    
    if (isNaN(playlistId) || isNaN(songId)) {
      return res.status(400).json({ message: "Invalid playlist or song ID" });
    }
    
    const playlist = await storage.getPlaylist(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    
    const song = await storage.getSong(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    
    await storage.addSongToPlaylist(playlistId, songId);
    res.status(204).end();
  });
  
  app.delete("/api/playlists/:playlistId/songs/:songId", async (req, res) => {
    const playlistId = parseInt(req.params.playlistId);
    const songId = parseInt(req.params.songId);
    
    if (isNaN(playlistId) || isNaN(songId)) {
      return res.status(400).json({ message: "Invalid playlist or song ID" });
    }
    
    await storage.removeSongFromPlaylist(playlistId, songId);
    res.status(204).end();
  });
  
  // Liked songs endpoints
  app.get("/api/playlists/liked", async (req, res) => {
    // For demo purposes, use user ID 1
    const userId = 1;
    const songs = await storage.getLikedSongs(userId);
    res.json({ id: "liked", name: "Liked Songs", songs });
  });
  
  app.post("/api/playlists/liked/songs/:songId", async (req, res) => {
    const songId = parseInt(req.params.songId);
    
    if (isNaN(songId)) {
      return res.status(400).json({ message: "Invalid song ID" });
    }
    
    const song = await storage.getSong(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }
    
    // For demo purposes, use user ID 1
    const userId = 1;
    await storage.addLikedSong(userId, songId);
    res.status(204).end();
  });
  
  app.delete("/api/playlists/liked/songs/:songId", async (req, res) => {
    const songId = parseInt(req.params.songId);
    
    if (isNaN(songId)) {
      return res.status(400).json({ message: "Invalid song ID" });
    }
    
    // For demo purposes, use user ID 1
    const userId = 1;
    await storage.removeLikedSong(userId, songId);
    res.status(204).end();
  });
  
  // Artists endpoints
  app.get("/api/artists", async (req, res) => {
    const artists = await storage.getAllArtists();
    res.json(artists);
  });
  
  app.get("/api/artists/:id", async (req, res) => {
    const artistId = parseInt(req.params.id);
    if (isNaN(artistId)) {
      return res.status(400).json({ message: "Invalid artist ID" });
    }
    
    const artist = await storage.getArtist(artistId);
    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }
    
    res.json(artist);
  });
  
  app.get("/api/artists/:id/songs", async (req, res) => {
    const artistId = parseInt(req.params.id);
    if (isNaN(artistId)) {
      return res.status(400).json({ message: "Invalid artist ID" });
    }
    
    const songs = await storage.getArtistSongs(artistId);
    res.json(songs);
  });

  const httpServer = createServer(app);
  return httpServer;
}
