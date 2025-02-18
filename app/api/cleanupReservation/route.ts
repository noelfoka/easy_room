import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Api pour supprimer les reservations expirées

export async function DELETE() {
  try {
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la reservation" },
      { status: 500 }
    );
  }
}
