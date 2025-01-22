"use client";
/* eslint-disable react-hooks/rules-of-hooks */

import Wrapper from "@/app/components/Wrapper";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import React, { useEffect, useState } from "react";
import Notification from "@/app/components/Notification";

interface Employee {
  id: string;
  email: string;
  familyName: string | null;
  givenName: string | null;
}

const page = ({ params }: { params: { companyId: string } }) => {
  const { user } = useKindeBrowserClient();
  const [employeeEmail, setEmployeeEmail] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [employees, setEmployees] = useState<Employee[] | null>([]);

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
          action: "ADD",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setNotification("L'employé a été ajouté avec succès");
        fetchEmployees();
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
      const response = await fetch(
        `/api/employees?companyId=${params.companyId}`
      );

      // Vérifier la réponse du serveur
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
        return;
      }

      // Récupérer les employés de la company
      const data = await response.json();
      setEmployees(data.employees);
      setCompanyName(data.company);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setNotification("Erreur survenue lors de la récupération des employés");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [params.companyId]);

  return (
    <Wrapper>
      {notification && (
        <Notification
          message={notification}
          onClose={closeNotification}
        ></Notification>
      )}

      <div>
        {loading ? (
          <div className="text-center mt-32">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div>
            <div className="badge badge-secondary badge-outline mb-2">
              {companyName}
            </div>
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
                <button type="submit" className="btn btn-secondary ml-2">
                  Ajouter un employé
                </button>
              </div>
            </form>

            <h1 className="text-2xl mb-4">Liste des employés</h1>
            <div className="mt-4">
              {employees && employees.length > 0 ? (
                <ol className="divide-base-200 divide-y">
                  {employees.map((employee) => {
                    const hasFullName =
                      employee.familyName && employee.givenName;
                    return (
                      <li
                        key={employee.id}
                        className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between"
                      >

                        <div className="flex items-center md:mb-0">
                          <span
                            className={`relative flex h-3 w-3 mr-2 rounded-full ${
                              hasFullName ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            <span
                              className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 ${
                                hasFullName ? "bg-green-500" : "bg-red-500"
                              }`}
                            ></span>
                            <span className="relative inline-flex rounded-full h-3 w-3"></span>
                          </span>

                          <div>
                            <span className="font-bold">{employee.email}</span>
                            <div className="md:mb-0 italic mt-1 text-gray-400">
                              {hasFullName
                                ? `${employee.givenName} ${employee.familyName}`
                                : "Pas encore inscrit"}
                            </div>
                            <button className="btn btn-outline btn-secondary btn-sm mt-2 md:mt-0 flex md:hidden">
                              Retirer
                            </button>
                          </div>

                        </div>

                        <div>
                          <button className="btn btn-outline btn-secondary btn-sm mt-2 md:mt-0 md:flex hidden">
                            Retirer
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p>Aucun employé trouvé</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default page;
