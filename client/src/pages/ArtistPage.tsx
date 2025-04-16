import { useMusicContext } from "@/context/MusicContext";
import { useEffect, useState } from "react";
import { Artist, Song } from "@shared/schema";

interface ArtistPageProps {
  params: {
    id: string;
  };
}

export default function ArtistPage({ params }: ArtistPageProps) {
  const { getArtist, getArtistSongs } = useMusicContext();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const artistId = parseInt(params.id);
        if (isNaN(artistId)) throw new Error('Invalid artist ID');

        const artistData = await getArtist(artistId);
        if (!artistData) throw new Error('Artist not found');
        setArtist(artistData);

        const artistSongs = await getArtistSongs(artistId);
        setSongs(artistSongs);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load artist');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtistData();
  }, [params.id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !artist) {
    return <div>Error: {error || 'Artist not found'}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-6 mb-8">
        <img 
          src={artist.imageUrl || ''} 
          alt={artist.name} 
          className="w-48 h-48 rounded-full object-cover"
        />
        <div>
          <h1 className="text-4xl font-bold mb-2">{artist.name}</h1>
          <p className="text-text-secondary">{songs.length} songs</p>
        </div>
      </div>

      <div className="space-y-2">
        {songs.map((song, index) => (
          <div 
            key={song.id} 
            className="flex items-center gap-4 p-2 rounded hover:bg-background-lighter cursor-pointer"
          >
            <span className="w-6 text-center text-text-secondary">{index + 1}</span>
            <img src={song.imageUrl || ''} alt={song.title} className="w-10 h-10 rounded" />
            <div>
              <p className="font-medium">{song.title}</p>
              <p className="text-sm text-text-secondary">{song.album || 'Single'}</p>
            </div>
            <span className="ml-auto text-text-secondary">{song.durationFormatted}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
