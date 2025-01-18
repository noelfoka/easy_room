import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

// Api de création de companies
export async function POST(request: Request) {
  try {
    // extraction des données de la requête
    const { email, companyName } = await request.json();

    // Vérifier si les champs requis sont présents
    if (!email || !companyName) {
      return NextResponse.json(
        { message: "Les champs 'email' et 'companyName' sont requis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà dans la base de données
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // si l'utilisateur n'existe pas
    if (!user) {
      return NextResponse.json(
        { message: "L'utilisateur n'existe pas" },
        { status: 404 }
      );
    }

    // Vérifier si la company existe déjà dans la base de données
    const existingCompany = await prisma.company.findUnique({
      where: { name: companyName },
    });

    // Vérifier si la company existe déjà dans la base de données
    if (existingCompany) {
      return NextResponse.json(
        { message: "Une entreprise avec ce nom existe déjà" },
        { status: 409 }
      );
    }

    // Créer la company
    const newCompany = await prisma.company.create({
      data: {
        name: companyName,
        createdBy: {
          connect: {
            id: user.id,
          },
        },
        employees: { connect: { id: user.id } },
      },
    });

    return NextResponse.json(
      { message: "La company a été créée avec succès", company: newCompany },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur api companies", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la création de la company" },
      { status: 500 }
    );
  }
}

// Api pour recuperer les informations d'une entreprise
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    // Vérifier si l'email est fourni
    if (!email) {
      return NextResponse.json(
        { message: "L'email est obligatoire" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe avec cet email
    const user = await prisma.user.findUnique({
      where: {email}
    })

  } catch (error) {
    console.error("Erreur api companies", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la création de la company" },
      { status: 500 }
    );
  }
}
