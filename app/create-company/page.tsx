/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Notification from "../components/Notification";
import Link from "next/link";

export interface Company {
  id: string;
  name: string;
}

const page = () => {
  // Récupération de l'utilisateur
  const { user } = useKindeBrowserClient();
  const [companyName, setCompanyName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [companies, setCompanies] = useState<Company[] | null>(null);

  const [notification, setNotification] = useState<string>("");
  const closeNotification = () => {
    setNotification("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Vérifier si le companyName existe
    if (!companyName) {
      setNotification("Le nom de l'entreprise est obligatoire");
      return;
    }

    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          companyName: companyName,
        }),
      });

      // Si la reponse n'est pas bonne
      if (!response.ok) {
        const { message } = await response.json();
        setNotification(message);
        return;
      }

      setNotification("L'entreprise a été créée avec succès");
      setCompanyName("");
    } catch (error) {
      console.error(error);
      setNotification(
        "Une erreur est survenue lors de la création de l'entreprise"
      );
    }
  };

  // Fonction permettant de récupérer la liste des entreprises
  const fetchCompanies = async () => {
    try {
      if (user?.email) {
        const response = await fetch(`/api/companies?email=${user.email}`, {
          method: "GET",
        });

        // Si la reponse n'est pas bonne
        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message);
        }
        const data = await response.json();
        setCompanies(data.companies);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setNotification(
        "Une erreur est survenue lors de la récupération des entreprises"
      );
    }
  };

  // Appel de la fonction fetchCompanies au chargement de la page
  useEffect(() => {
    fetchCompanies();
    setLoading(false);
  }, [user]);

  return (
    <Wrapper>
      {notification && (
        <Notification
          message={notification}
          onClose={closeNotification}
        ></Notification>
      )}
      <div>
        <h1 className="text-2xl mb-4">Créer une entreprise</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row">
            <input
              type="text"
              name="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              id="companyName"
              placeholder="Nom de l'entreprise"
              required
              className="input input-bordered w-full max-w-xs"
            />

            <button type="submit" className="btn btn-secondary ml-2">
              Creer l&apos;entreprise
            </button>
          </div>
        </form>

        <h1 className="text-2xl mb-4 font-bold">Mes entreprises</h1>

        {loading ? (
          <div className="text-center mt-32">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : companies && companies.length > 0 ? (
          <ul className="list-decimal divide-base-200 divide-y">
            {companies.map((company) => (
              <li key={company.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between">
                <div className="badge badge-secondary badge-outline mb-2 md:mb-0">
                  {company.name}
                </div>
                <div className="flex items-center">
                  <Link href={`employees/${company.id}`} className="btn btn-sm btn-outline btn-secondary mr-2">Ajouter des employés</Link>
                  <Link href={`rooms/${company.id}`} className="btn btn-sm btn-outline btn-secondary mr-2">Ajouter des salles</Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune entreprise trouvée</p>
        )}
      </div>
    </Wrapper>
  );
};

export default page;
