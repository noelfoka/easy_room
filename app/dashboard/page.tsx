/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useEffect, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Wrapper from "../components/Wrapper";

const page = () => {
  const { user } = useKindeBrowserClient();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCompanyId = async () => {
    // Vérifier si il y a un user connecté
    if (user) {
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            familyName: user.family_name,
            givenName: user.given_name,
          }),
        });

        // Récupérer les données de l'utilisateur
        const data = await response.json();

        // Mettre à jour le companyId
        setCompanyId(data.companyId || null);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setCompanyId(null);
      }
    }
  };

  const fetchRooms = async () => {
    if (companyId) {
      setLoading(true);
      try {

        const response = await fetch(`/api/rooms?companyId=${companyId}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des salles");
        }

        const data = await response.json();
        
      } catch (error) {
        console.error(error);
        // setNotification(
        //   "Une erreur est survenue lors de la récupération des salles"
        // );
      }
    }
  }

  // Appel de la fonction fetchCompanyId au chargement de la page
  useEffect(() => {
    const initializeData = async () => {
      await fetchCompanyId();
    };
    initializeData();
  }, [user]);

  if (loading) {
    return (
      <Wrapper>
        <div className="w-full flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div>
        <div>
          <div className="badge badge-secondary badge-outline">
            Company ID: {companyId}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default page;
