"use client"

import React, { useState } from "react";
import Wrapper from "../components/Wrapper";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Notification from "../components/Notification";

const page = () => {

  // Récupération de l'utilisateur
  const { user } = useKindeBrowserClient();
  const [companyName, setCompanyName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<string>("");

  const closeNotification = () => {
    setNotification("");
  }

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
          companyName: companyName
        })
      })

      // Si la reponse n'est pas bonne
      if (!response.ok) {
        const {message} = await response.json();
        setNotification(message);
        return;
      }

      setNotification("L'entreprise a été créée avec succès");
      setCompanyName("");

    } catch (error) {
      console.error(error);
      setNotification("Une erreur est survenue lors de la création de l'entreprise");
    }
  };

  return (
    <Wrapper>
      {notification && (<Notification message={notification} onClose={closeNotification}></Notification>)}
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

            <button type="submit" className="btn btn-secondary ml-2">Creer l&apos;entreprise</button>
          </div>
        </form>
      </div>
    </Wrapper>
  );
};

export default page;
