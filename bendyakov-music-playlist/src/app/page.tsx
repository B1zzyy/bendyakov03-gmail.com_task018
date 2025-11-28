'use client'

import { useState, useEffect } from 'react';

interface Song {
  id: string;
  name: string;
  artist: string;
  rating: number;
}

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [newSong, setNewSong] = useState({
    name: '',
    artist: '',
    rating: 0,
  });

  // Load songs from localStorage on initial render
  useEffect(() => {
    const savedSongs = localStorage.getItem('songs');
    if (savedSongs) {
      setSongs(JSON.parse(savedSongs));
    }
  }, []);

  // Save songs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('songs', JSON.stringify(songs));
  }, [songs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSong(prev => ({
      ...prev,
      [name]: value === 'rating' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSong.name && newSong.artist && newSong.rating) {
      const songToAdd: Song = {
        id: Date.now().toString(),
        ...newSong,
      };
      setSongs(prev => [...prev, songToAdd]);
      setNewSong({ name: '', artist: '', rating: 0 });
    }
  };

  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <main className="flex min-h-screen p-4">
      {/* Left Column - Add Song Form */}
      <div className="w-1/3 pr-4">
        <h1 className="text-2xl font-bold mb-4">Add New Song</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Song Name</label>
            <input
              type="text"
              name="name"
              value={newSong.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Artist</label>
            <input
              type="text"
              name="artist"
              value={newSong.artist}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-2xl cursor-pointer ${
                    star <= newSong.rating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                  onClick={() => setNewSong(prev => ({ ...prev, rating: star }))}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Song
          </button>
        </form>
      </div>

      {/* Right Column - Song List */}
      <div className="w-2/3 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Playlist</h1>
        <div className="space-y-4">
          {songs.map(song => (
            <div key={song.id} className="flex items-center p-4 bg-gray-100 rounded">
              {/* Vinyl Placeholder */}
              <div className="w-16 h-16 bg-gray-400 rounded-full mr-4 flex items-center justify-center text-white">
                Vinyl
              </div>
              {/* Song Details */}
              <div>
                <h2 className="font-semibold">{song.name}</h2>
                <p className="text-sm text-gray-600">{song.artist}</p>
                <div className="mt-1">{renderRating(song.rating)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
