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
