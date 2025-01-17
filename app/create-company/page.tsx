"use client";

import React, { useState } from "react";
import Wrapper from "../components/Wrapper";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const page = () => {

  // Récupération de l'utilisateur
  const { user } = useKindeBrowserClient();
  const [companyName, setCompanyName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Vérifier si le companyName existe
    if (!companyName) {
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
        alert(message);
        return;
      }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Wrapper>
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
