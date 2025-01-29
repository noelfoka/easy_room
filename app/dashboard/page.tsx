"use client";

import React, { useEffect, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Wrapper from "../components/Wrapper";

const Page = () => {
  const { user } = useKindeBrowserClient();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [rooms, setRooms] = useState<unknown[]>([]);
  const [companyName, setCompanyName] = useState<string>("");

  // Récupérer companyId
  useEffect(() => {
    const fetchCompanyId = async () => {
      if (!user) return;

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

        const data = await response.json();
        console.log("Réponse API users:", data); // Debug

        if (data.companyId) {
          setCompanyId(data.companyId);
        } else {
          console.warn("companyId non trouvé dans la réponse API");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du companyId :", error);
      }
    };

    fetchCompanyId();
  }, [user]);

  // Récupérer les rooms après l'obtention de companyId
  useEffect(() => {
    const fetchRooms = async () => {
      if (!companyId) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/rooms?companyId=${companyId}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des salles");
        }

        const data = await response.json();
        console.log("Réponse API rooms:", data); // Debug

        setRooms(data.rooms || []);
        setCompanyName(data.company || "Nom inconnu");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [companyId]);

  // Vérifier si le nom de l'entreprise est mis à jour
  useEffect(() => {
    console.log("Company name mis à jour :", companyName);
  }, [companyName]);

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
          {companyId && (
            <div className="badge badge-secondary badge-outline">
              {companyName}
            </div>
          )}

          <h1 className="text-2xl mt-4">Réserver une salle</h1>

          {loading ? (
            <div className="text-center mt-32">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
          ) : (
            !companyId ? (
              <div>Vous n&apos;êtes pas associé à une entreprise</div>
            ) : (
              rooms.length === 0 ? (
                <p>Aucune salle n&apos;est disponible pour le moment pour votre entreprise</p>
              ) : (
                <ul className="grid md:grid-cols-3 gap-4"></ul>
              )
            )
          )}

        </div>
      </div>
    </Wrapper>
  );
};

export default Page;
