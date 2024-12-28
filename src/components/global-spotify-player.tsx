import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Card } from '@/components/ui/card';

// Context for managing the player state globally
const PlayerContext = createContext({
  playTrack: (track: SpotifyTrack) => {},
  isPlaying: false,
  currentTrack: null as SpotifyTrack | null,
});

// Types
interface SpotifyTrack {
  name: string;
  artist?: string;
  albumImageUrl?: string;
  previewUrl: string;
}

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = (track: SpotifyTrack) => {
    if (!track.previewUrl) return;
    
    if (currentTrack?.previewUrl === track.previewUrl) {
      // Toggle play/pause if same track
      if (isPlaying) {
        audioRef.current?.pause();
      } else {
        audioRef.current?.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      // Play new track
      setCurrentTrack(track);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = track.previewUrl;
        audioRef.current.play();
      }
    }
  };

  return (
    <PlayerContext.Provider value={{ playTrack, isPlaying, currentTrack }}>
      {children}
      <GlobalPlayer audioRef={audioRef} />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);

const GlobalPlayer = ({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement> }) => {
  const { currentTrack, isPlaying } = usePlayer();
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  // Create audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update progress bar
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, []);

  if (!currentTrack) return null;

  return (
    <Card className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t transform transition-transform duration-300 ease-in-out">
      <div className="flex items-center gap-4 max-w-6xl mx-auto">
        {/* Album Art */}
        {currentTrack.albumImageUrl && (
          <div className="relative w-12 h-12 rounded overflow-hidden">
            <img
              src={currentTrack.albumImageUrl}
              alt={currentTrack.name}
              className="object-cover"
            />
          </div>
        )}

        {/* Track Info */}
        <div className="flex-1">
          <div className="font-medium">{currentTrack.name}</div>
          {currentTrack.artist && (
            <div className="text-sm text-gray-500">{currentTrack.artist}</div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={() => audioRef.current?.paused 
              ? audioRef.current.play() 
              : audioRef.current?.pause()
            }
            className="p-2 rounded-full hover:bg-gray-100"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6" />
            )}
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.muted = !isMuted;
                  setIsMuted(!isMuted);
                }
              }}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value);
                setVolume(newVolume);
                if (audioRef.current) {
                  audioRef.current.volume = newVolume;
                }
              }}
              className="w-24"
            />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
          <div
            className="h-full bg-blue-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
    </Card>
  );
};

export default GlobalPlayer;