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

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/companies", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: params.companyId,
          creatorEmail: user?.email,
          employeeEmail: employeeEmail,
          action: "ADD"
        })
      });

    const data  = await response.json();

    if (response.ok) {
      setNotification("L'employé a été ajouté avec succès");
    } else {
      setNotification(`${data.message}`);
    }
    setEmployeeEmail("");

    } catch (error) {
      console.error(error);
      setNotification("Erreur interne du serveur");
    }
  };

  const fetchEmployees = async () => {
    try {

      const response = await fetch(`/api/employees?companyId=${params.companyId}`);
      
    } catch (error) {
      console.error(error);
      setNotification("Erreur survenue lors de la récupération des employés");
    }
  }

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

          <form onSubmit={handleAddEmployee}>
            <div className="mb-4 flex flex-row">
              <input
                type="email"
                className="input input-bordered w-full max-w-xs"
                value={employeeEmail}
                onChange={(e) => setEmployeeEmail(e.target.value)}
                placeholder="Email de l'employé"
                required
              />
              <button type="submit" className="btn btn-secondary ml-2">Ajouter un employé</button>
            </div>
          </form>
        </div>
        {/* )} */}
      </div>
    </Wrapper>
  );
};

export default page;
