import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

// Api permettant de récupérer les employés d'une entreprise
export async function GET(request: Request) {
  try {

    // Extraire l'id de la company à récupérer
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");

    // Vérifier si l'id de la company est fourni
    if (!companyId) {
      return NextResponse.json(
        { message: "L'id de la company est obligatoire" },
        { status: 400 }
      );
    }

    // Récupérer les employés de la company
    const employees = await prisma.user.findMany({
      where: { companyId },
      select: {
        id: true,
        email: true,
        familyName: true,
        givenName: true
      }
    });

    // Récupérer le nom de la company
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        name: true
      }
    })

    const formatedEmployees = employees.map((employee) => ({
      id: employee.id,
      email: employee.email,
      familyName: employee.familyName || null,
      givenName: employee.givenName || null,
    }))

    return NextResponse.json({employees: formatedEmployees, company: company?.name}, {status: 200});
    
  } catch (error) {
    console.error("Erreur api employees", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la récupération des employés" },
      { status: 500 }
    );
    
  }
}