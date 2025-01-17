"use client";

import React, { useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Wrapper from "../components/Wrapper";

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = useKindeBrowserClient();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCompanyId = async () => {
   // Vérifier si il y a un user connecté
   if (user) {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          familyName: user.family_name,
          givenName: user.given_name
        })
      });

      // Récupérer les données de l'utilisateur
      const data = await response.json();

    } catch (error) {
      console.error(error);
      setCompanyId(null);
    }
   }
  }

  return (
    <Wrapper>
      <div>
        
      </div>
    </Wrapper>
  );
};

export default page;
