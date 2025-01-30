// Api pour afficher les salles disponibles

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {

    // recuperation des données de la requête
    const { roomId, reservationDate } = await request.json();

    // Vérifier si les champs requis sont présents
    if (!roomId || !reservationDate) {
      return NextResponse.json(
        { message: "Les informations sont incomplètes" },
        { status: 400 }
      );
    }

    // Validation du format de la date
    const datePart = reservationDate.split("/");

    if (datePart.length !== 3 || datePart[2].length !== 4) {
      return NextResponse.json(
        { message: "La date de réservation est incorrecte. Utiliser le format jj/mm/aaaa" },
        { status: 400 }
      );
    }

    // la date
    const date = new Date(`${datePart[2]}-${datePart[1]}-${datePart[0]}`);

    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      return NextResponse.json(
        { message: "La date de réservation est invalide" },
        { status: 400 }
      );
    }

    // Vérifier si la salle recuperée existe
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room) {
      return NextResponse.json(
        { message: "La salle n'existe pas" },
        { status: 400 }
      );
    }

    // Récupérer toutes les reservations de cette salle à la date donnée
    const existingReservations = await prisma.reservation.findMany({
      where: {
        roomId: roomId,
        reservationDate: reservationDate,
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });
    
  } catch (error) {
    console.error("Erreur api disponibilities", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la récupération des salles disponibles" },
      { status: 500 }
    );
  }
}