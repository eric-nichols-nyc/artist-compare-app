'use client';

import AddArtistForm from '@/components/new-artist-form';

export default function AdminPage() {
    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Add Artist to Database</h1>
            <AddArtistForm />
        </div>
    );
} 