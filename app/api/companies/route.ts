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
      where: { email },
    });

    // si l'utilisateur n'existe pas
    if (!user) {
      return NextResponse.json(
        { message: "L'utilisateur n'existe pas" },
        { status: 404 }
      );
    }

    // Récupérer la liste des entreprises de l'utilisateur
    const companies = await prisma.company.findMany({
      where: {createdById: user.id}
    });

    return NextResponse.json({companies},  { status: 200 });

  } catch (error) {
    console.error("Erreur api companies", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la création de la company" },
      { status: 500 }
    );
  }
}

// Api de suppression d'une entreprise
export async function DELETE(request: Request) {
  try {
    // Extraire l'id de la company à supprimer
    const { id } = await request.json();

    // Vérifier si l'entreprise existe
    const company = await prisma.company.findUnique({
      where: {id}
    })

    // Vérifier si on a cette entreprise
    if (!company) {
      return NextResponse.json(
        { message: "L'entreprise n'existe pas" },
        { status: 404 }
      );
    }

    // mettre à jour la liste des employés de cette entreprise
    await prisma.user.updateMany({
      where: {companyId: id},
      data: {
        companyId: null
      }
    })

    // Supprimer la company
    await prisma.company.delete({
      where: {id}
    });

    return NextResponse.json(
      { message: "L'entreprise a été supprimée avec succès" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur api companies", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la suppression de la company" },
      { status: 500 }
    );
  }
}

// Api qui permet d'ajouter et supprimer des employés à une entreprise
export async function PATCH(request: Request) {
  try {

    // Extraire les données du corps de la requête
    const {id, creatorEmail, employeeEmail, action} = await request.json();

    // Vérifier l'existance du createur de l'entreprise
    const creator = await prisma.user.findUnique({
      where: {email: creatorEmail}
    });

    // Si le createur n'existe pas
    if (!creator) {
      return NextResponse.json(
        { message: "Le createur de l'entreprise non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier si l'entreprise identifiée par l'id existe
    const company = await prisma.company.findUnique({
      where: {id}
    });
    
  } catch (error) {
    console.error("Erreur api companies", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la suppression de l'employé" },
      { status: 500 }
    );
  }
}
