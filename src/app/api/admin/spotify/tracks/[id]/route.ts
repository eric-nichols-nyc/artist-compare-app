import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    const { artistId } = await req.json();
    return NextResponse.json({message: 'Artist spotify tracks fetched', artistId});
}