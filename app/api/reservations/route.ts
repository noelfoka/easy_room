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
    
  } catch (error) {
    console.error("Erreur api reservations", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la création de la reservation" },
      { status: 500 }
    );
  }
}