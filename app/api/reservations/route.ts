/* eslint-disable @typescript-eslint/no-unused-vars */
// Api route pour les reservations
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface ReservationRequest {
  email: string;
  roomId: string;
  reservationDate: string;
  timeSlots: string[];
}

// Api pour créer les réservations
export async function POST(request: Request) {
  try {
    // recuperation des données de la requête
    const body = await request.text();
    const { email, roomId, reservationDate, timeSlots }: ReservationRequest =
      JSON.parse(body);

    // Vérifier si les champs requis sont présents
    if (
      !email ||
      !roomId ||
      !reservationDate ||
      !timeSlots ||
      !Array.isArray(timeSlots)
    ) {
      return NextResponse.json(
        {
          message:
            "Les informations sont incomplètes et timeSlots doit être un tableau",
        },
        { status: 400 }
      );
    }

    // Recherche de l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Si l'utilisateur n'est pas trouvé
    if (!user) {
      return NextResponse.json(
        { message: "L'utilisateur n'est pas trouvé" },
        { status: 404 }
      );
    }

    // Creer des reservation pour chaque timeSlot
    const reservations = await Promise.all(
      timeSlots.map(async (timeSlot) => {
        // Vérifier si le créneau est bien formé
        if (!timeSlot.includes(" - ")) {
          throw new Error(`Le créneau n'est pas bien formé: ${timeSlot}`);
        }

        // Extraire les dates de début et de fin
        const [startDate, endDate] = timeSlot.split(" - ");

        return prisma.reservation.create({
          data: {
            userId: user.id,
            roomId: roomId,
            reservationDate: reservationDate,
            startTime: startDate,
            endTime: endDate,
          },
        });
      })
    );
    return NextResponse.json(
      { reservations },
      { status: 201 }
    );

  } catch (error) {
    console.log("Erreur api reservations", error);
    return NextResponse.json(
      {
        message:
          "Une erreur est survenue lors de la création de la reservation",
      },
      { status: 500 }
    );
  }
}

// Api pour récupérer les réservations
export async function GET(request: Request) {
  try {

      const { searchParams } = new URL(request.url)
      const email = searchParams.get('email')

      if (!email) {
          return NextResponse.json({ message: "email manquant" }, { status: 400 });
      }
      const user = await prisma.user.findUnique({
          where: { email },
          include: {
              reservations: {
                  include: {
                      room: true
                  }
              }
          }
      })

      if (!user) {
          return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
      }

      const reservationWithoutUserId = user.reservations.map(({ userId, ...rest }) => rest)

      return NextResponse.json({ reservationWithoutUserId }, { status: 200 });

  } catch (error) {
      console.error('Error in API:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Api pour suprimer les réservations
export async function DELETE(request: Request) {
  try {
    // recuperation des données de la requête
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ message: "id manquant" }, { status: 400 });
    }

    // Supprimer la reservation par id
    const deleteReservation = await prisma.reservation.delete({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.error('Erreur de supression des reservations:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression des réservations' }, { status: 500 });
  }
}
