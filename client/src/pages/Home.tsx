import SongCard from "@/components/SongCard";
import { useMusicContext } from "@/context/MusicContext";
import { Link } from "wouter";

export default function Home() {
  const { recentlyPlayed, topSongs, featuredArtists } = useMusicContext();

  return (
    <div>
      
      <div className="px-6 py-4">
        {/* Recently Played Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Recently Played</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {recentlyPlayed.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
        
        {/* Featured Artists Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Artists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {featuredArtists.map((artist) => (
              <div key={artist.id} className="bg-background-card p-4 rounded-lg hover:bg-background-card/80 transition-all cursor-pointer">
                <div className="aspect-square mb-4 rounded-full overflow-hidden">
                  <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-center text-base font-semibold">{artist.name}</h3>
                <p className="text-center text-sm text-text-secondary">Artist</p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Top Hits Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Today's Top Hits</h2>
            <Link href="/search?category=top">
              <a className="text-sm text-text-secondary hover:text-primary">See All</a>
            </Link>
          </div>
          
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
                {topSongs.map((song, index) => (
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
        </section>
      </div>
    </div>
  );
}
