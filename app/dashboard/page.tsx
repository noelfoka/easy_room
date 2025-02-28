"use client";

import React, { useEffect, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Wrapper from "../components/Wrapper";
import Image from "next/image";
import { SquareArrowOutUpRight, Users } from "lucide-react";
import Link from "next/link";

interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string;
  imgUrl: string;
}

const Page: React.FC = () => {
  const { user } = useKindeBrowserClient();
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [companyName, setCompanyName] = useState<string>("");

  // Supprimer les réservations expirées
  const cleanupExpiredReservation = async () => {
    try {
      await fetch('/api/cleanupReservations', { method: 'DELETE' });
    } catch (error) {
      console.error("Erreur lors du nettoyage des réservations :", error);
    }
  };

  // Récupérer companyId
  const fetchCompanyId = async () => {
    if (!user || companyId) return;

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          familyName: user.family_name,
          givenName: user.given_name,
        }),
      });

      const data = await response.json();
      if (data.companyId) {
        setCompanyId(data.companyId);
      } else {
        console.warn("companyId non trouvé");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du companyId :", error);
    }
  };

  // Récupérer les salles après l'obtention du companyId
  const fetchRooms = async () => {
    if (!companyId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/rooms?companyId=${companyId}`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des salles");

      const data = await response.json();
      setRooms(data.rooms || []);
      setCompanyName(data.company || "Nom inconnu");
    } catch (error) {
      console.error("Erreur lors de la récupération des salles :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cleanupExpiredReservation();
    fetchCompanyId();
  }, [user]);

  useEffect(() => {
    if (companyId) fetchRooms();
  }, [companyId]);

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
        {companyId && (
          <div className="badge badge-secondary badge-outline">{companyName}</div>
        )}

        <h1 className="text-2xl my-4">Réserver une salle</h1>

        {!companyId ? (
          <div>Vous n&apos;êtes pas associé à une entreprise</div>
        ) : rooms.length === 0 ? (
          <p>Aucune salle n&apos;est disponible pour le moment.</p>
        ) : (
          <ul className="grid md:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <li key={room.id} className="flex flex-col border border-base-300 p-5 rounded-2xl">
                <Image
                  src={room.imgUrl || "/pexels.jpg"}
                  alt={room.name}
                  width={400}
                  height={400}
                  quality={100}
                  className="shadow-sm w-full h-48 object-cover rounded-xl"
                />

                <div className="mt-4">
                  <div className="flex items-center">
                    <div className="badge badge-secondary">
                      <Users className="mr-2 w-4" />
                      {room.capacity}
                    </div>
                    <h1 className="font-bold text-xl ml-2">{room.name}</h1>
                  </div>
                  <p className="text-sm my-2 text-gray-500">
                    {room.description.length > 100
                      ? `${room.description.slice(0, 100)}...`
                      : room.description}
                  </p>

                  <Link className="btn btn-secondary btn-outline btn-sm mt-2" href={`/reservations/${room.id}`}>
                    <SquareArrowOutUpRight className="w-4" />
                    Reserver
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Wrapper>
  );
};

export default Page;
