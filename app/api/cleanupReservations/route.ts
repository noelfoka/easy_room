import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import dayjs from "dayjs";

// Api pour supprimer les reservations expirées

export async function DELETE() {
  try {
    const now = dayjs();

    const expireReservations = await prisma.reservation.findMany({
      where: {
        OR: [
          {
            reservationDate: {
              lt: now.format("DD/MM/YYYY"),
            },
          },
          {
            reservationDate: {
              lt: now.format("DD/MM/YYYY"),
            },
            endTime: {
              lt: now.format("HH:mm"),
            },
          },
        ],
      },
    });

    if (expireReservations.length > 0) {
      await prisma.reservation.deleteMany({
        where: {
          id: {
            in: expireReservations.map((reservation) => reservation.id),
          },
        },
      });
    }

    return NextResponse.json(
      { message: "Suppression des reservations expirées réussies" },
      { status: 200 }
    );
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la reservation" },
      { status: 500 }
    );
  }
}
