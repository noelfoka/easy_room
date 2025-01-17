"use client";

import React, { useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Wrapper from "../components/Wrapper";

const page = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { user } = useKindeBrowserClient();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCompanyId = async () => {}

  return (
    <Wrapper>
      <div>
        
      </div>
    </Wrapper>
  );
};

export default page;
