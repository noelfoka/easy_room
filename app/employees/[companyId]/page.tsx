"use client";
/* eslint-disable react-hooks/rules-of-hooks */

import Wrapper from "@/app/components/Wrapper";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import React, { useState } from "react";
import Notification from "@/app/components/Notification";

const page = ({ params }: { params: { companyId: string } }) => {
  const { user } = useKindeBrowserClient();
  const [employeeEmail, setEmployeeEmail] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

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

      <div>
        {/* {loading ? (
          <div className="text-center mt-32">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : ( */}
        <div>
          <h1 className="text-2xl mb-4">Ajouter un nouvel employé</h1>
        </div>
        {/* )} */}
      </div>
    </Wrapper>
  );
};

export default page;
