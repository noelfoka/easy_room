import { NextResponse } from "next/server";
import prisma from "@/prisma/lib/prisma";

// Api permettant de récupérer les employés d'une entreprise
export async function GET(request: Request) {
  try {

    // Extraire l'id de la company à récupérer
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    
  } catch (error) {
    console.error("Erreur api employees", error);
    return NextResponse.json(
      { message: "Une erreur est survenue lors de la récupération des employés" },
      { status: 500 }
    );
    
  }
}