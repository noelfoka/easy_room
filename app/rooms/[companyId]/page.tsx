/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Wrapper from "@/app/components/Wrapper";
import React, { useState } from "react";
import Notification from "@/app/components/Notification";

const page = ({ params }: { params: { companyId: string } }) => {
  const [notification, setNotification] = useState<string>("");
  const closeNotification = () => {
    setNotification("");
  };

  return (
    <Wrapper>
      {notification && (
        <Notification
          message={notification}
          onClose={closeNotification}
        ></Notification>
      )}

      <div>{params.companyId}</div>

      <section className="w-[450px] ml-8 hidden md:block">
        <h1 className="text-2xl mb-4">Créer une salle</h1>
      </section>

    </Wrapper>
  );
};

export default page;
