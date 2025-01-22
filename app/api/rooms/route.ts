// Api de creation de salles

import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function POST(request: Request) {
  try {

    // extraction des données de la requête
    const {action, name, capacity, description, imgUrl, companyId} = await request.json();
  } catch (error) {
    console.error("Erreur api rooms", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la création de la salle" },
      { status: 500 }
    );
  }
}