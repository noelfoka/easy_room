// Api de creation de salles

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

      return NextResponse.json(
        { message: "Image enregistrée avec succès", roomId: updatedRoom.id },
        { status: 201 }
      );

    }
  } catch (error) {
    console.error("Erreur api rooms", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la création de la salle" },
      { status: 500 }
    );
  }
}

// Api d'affichage des salles
export async function GET(request: Request) {
  try {

    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    // Vérifier si l'id de la company est fourni
    if (!companyId) {
      return NextResponse.json(
        { message: "L'id de la company est obligatoire" },
        { status: 400 }
      );
    }

    // Récupérer les salles de la company
    const rooms = await prisma.room.findMany({
      where: { companyId: companyId }
    });

    // Récupérer le nom de la company
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    return NextResponse.json({ rooms, company: company?.name }, { status: 200 });
    
  } catch (error) {
    console.error("Erreur api rooms", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de l'affichage des salles" },
      { status: 500 }
    );
  }
}

// Api de suppression d'une salle
export async function DELETE(request: Request) {
  try {

    // Récupération des paramètres de la requête
    const { roomId } = await request.json();

    // Vérification que le paramètre de salle est présent
    if (!roomId) {
      return NextResponse.json(
        { message: "Aucun paramètre de salle n'a été fourni" },
        { status: 400 }
      );
    }

    // Suppression de la salle
    await prisma.room.delete({
      where: {
        id: roomId,
      },
    });

    return NextResponse.json({ message: "Salle supprimée avec succès" }, {
      status: 200,
    });
    
  } catch (error) {
    console.error("Erreur api rooms", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la suppression d'une salle" },
      { status: 500 }
    );
  }
}
