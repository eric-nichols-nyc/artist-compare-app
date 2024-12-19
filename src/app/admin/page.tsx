'use client';

import AddArtistForm from '@/components/AddArtistForm';
import { Button } from '@/components/ui/button';
import  Link  from 'next/link';
export default function AdminPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
            <Link href="/admin/add-artist">
                <Button>
                    Add Artist
                </Button>
            </Link>
        </div>
    );
} 