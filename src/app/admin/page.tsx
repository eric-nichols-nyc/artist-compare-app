'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function AdminPage() {
    const [artistName, setArtistName] = useState('');
    const [artistData, setArtistData] = useState<any>(null);
    const [status, setStatus] = useState<{
        type: 'idle' | 'loading' | 'success' | 'error';
        message?: string;
    }>({ type: 'idle' });

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!artistName.trim()) {
            setStatus({ 
                type: 'error', 
                message: 'Please enter an artist name' 
            });
            return;
        }

        setStatus({ type: 'loading' });
        
        try {
            const response = await fetch('/api/artists/add', {
                method: 'POST',
                body: JSON.stringify({ artistName })
            });

            const data = await response.json();
            if (response.ok) {
                setArtistData(data);
                setStatus({ type: 'success' });
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: error instanceof Error ? error.message : 'Failed to search artist' 
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        console.log('handleSubmit');
        e.preventDefault();
        
        if (!artistName.trim()) {
            setStatus({ 
                type: 'error', 
                message: 'Please enter an artist name' 
            });
            return;
        }

        setStatus({ type: 'loading' });
        
        try {
            const artistResponse = await fetch('/api/artists/add', {
                method: 'POST',
                body: JSON.stringify({ artistName })
            });

            const artistData = await artistResponse.json();
            console.log('artistData', artistData);
            
            setStatus({ 
                type: 'success', 
                message: `Successfully added ${artistName} to the database` 
            });
            setArtistName('');
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: error instanceof Error ? error.message : 'Failed to add artist' 
            });
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Add Artist to Database</h1>
            
            <form onSubmit={handleSearch} className="space-y-4">
                <div>
                    <label 
                        htmlFor="artistName" 
                        className="block text-sm font-medium mb-2"
                    >
                        Artist Name
                    </label>
                    <input
                        id="artistName"
                        type="text"
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="Enter artist name"
                        disabled={status.type === 'loading'}
                    />
                </div>

                <button
                    type="submit"
                    disabled={status.type === 'loading'}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                >
                    {status.type === 'loading' ? 'Searching...' : 'Search Artist'}
                </button>
            </form>

            {artistData && (
                <div className="mt-6 p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                        {artistData.images?.[0] && (
                            <Image
                                src={artistData.images[0].url}
                                alt={artistData.name}
                                width={100}
                                height={100}
                                className="rounded-full"
                            />
                        )}
                        <div>
                            <h2 className="text-xl font-bold">{artistData.name}</h2>
                            <p className="text-gray-600">Followers: {artistData.followers?.total?.toLocaleString()}</p>
                            <p className="text-gray-600">Popularity: {artistData.popularity}/100</p>
                            {artistData.genres?.length > 0 && (
                                <p className="text-gray-600">Genres: {artistData.genres.join(', ')}</p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                    >
                        Add Artist to Database
                    </button>
                </div>
            )}

            {status.message && (
                <div 
                    className={`mt-4 p-4 rounded-md ${
                        status.type === 'success' 
                            ? 'bg-green-100 text-green-700' 
                            : status.type === 'error' 
                            ? 'bg-red-100 text-red-700' 
                            : ''
                    }`}
                >
                    {status.message}
                </div>
            )}
        </div>
    );
} 