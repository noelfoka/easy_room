// Api route pour les reservations
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

interface ReservationRequest {
  email: string;
  roomId: string;
  reservationDate: string;
  timeSlots: string [];
}

export async function POST(request: NextRequest) {
  try {

    // recuperation des données de la requête
    const body = await request.text();
    const { email, roomId, reservationDate, timeSlots }: ReservationRequest = JSON.parse(body);

    // Vérifier si les champs requis sont présents
    if (!email || !roomId || !reservationDate || !timeSlots) {
      return NextResponse.json(
        { message: "Les informations sont incomplètes" },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error("Erreur api reservations", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la création de la reservation" },
      { status: 500 }
    );
  }
}