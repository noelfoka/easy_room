// Api de création de companies

import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function POST(request: Request) {
  try {
    
  } catch (error) {
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la création de la company" },
      { status: 500 }
    )
  }
}