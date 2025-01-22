// Api de creation de salles

import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

export async function POST(request: Request) {
  try {
    // extraction des données de la requête
    const { action, name, capacity, description, imgUrl, companyId, roomId } =
      await request.json();

    // définir l'action
    if (action === "SAVE_DATA") {
      // Vérification de certaines informations
      if (!name || !capacity || !companyId) {
        return NextResponse.json(
          { message: "Les informations sont incomplètes" },
          { status: 400 }
        );
      }

      // Vérification de l'existence de la salle pour cette entreprise
      const existingRoom = await prisma.room.findFirst({
        where: {
          name: name,
          companyId: companyId,
        },
      });

      if (existingRoom) {
        return NextResponse.json(
          { message: "Cette salle existe déjà pour cette entreprise" },
          { status: 409 }
        );
      }

      // Creer la salle
      const newRoom = await prisma.room.create({
        data: {
          name,
          capacity: parseInt(capacity, 10),
          description,
          company: { connect: { id: companyId } },
        },
      });

      return NextResponse.json(
        { message: "Salle créee avec succès", roomId: newRoom.id },
        { status: 201 }
      );
    } else if (action === "SAVE_IMAGE") {
      // Enregistrer l'image

      // Vérifier que roomId et imgUrl sont présents
      if (!roomId || !imgUrl) {
        return NextResponse.json(
          { message: "roomId et imgUrl sont obligatoires" },
          { status: 400 }
        );
      }

      // Mettre à jour la salle
      const updatedRoom = await prisma.room.update({
        where: {id: roomId},
        data: {
          imgUrl,
        },
      });

    }
  } catch (error) {
    console.error("Erreur api rooms", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la création de la salle" },
      { status: 500 }
    );
  }
}
