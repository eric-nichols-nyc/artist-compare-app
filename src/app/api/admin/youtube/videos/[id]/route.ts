import { NextResponse } from "next/server";

export const GET = async (req: Request) => {
    const { artistName } = await req.json();
    return NextResponse.json({message: 'Artist youtube videos fetched', artistName});
}