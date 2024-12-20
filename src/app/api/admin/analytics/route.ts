import { NextResponse } from "next/server";


const POST = async (req: Request) => {
    const { artistId } = await req.json();
    return NextResponse.json({message: 'Artist music brainz info fetched', artistId});
}