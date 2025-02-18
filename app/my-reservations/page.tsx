/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { useEffect, useState } from "react";
import Wrapper from "../components/Wrapper";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import Image from "next/image";
import { CalendarDays, Clock3, Users } from "lucide-react";

interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string;
  imgUrl: string;
}

interface Reservation {
  id: string;
  room: Room;
  reservationDate: string;
  startTime: string;
  endTime: string;
}

interface ApiResponse {
  reservationWithoutUserId: Reservation[];
}

const page = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useKindeBrowserClient();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const fetchReservations = async () => {
    if (!user?.email) return;
    try {
      const response = await fetch(`/api/reservations?email=${user?.email}`);
      const data: ApiResponse = await response.json();
      setReservations(data.reservationWithoutUserId);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  
  const deleteRervation = async (id: string) => {
    try {
      const response = await fetch(`/api/reservations`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
        }),
      });

      if (response.ok) {
        fetchReservations();
      } else {
        console.error("Erreur lors de la suppression de la reservation");
      }
    } catch (error) {
      console.error("Erreur lors de la supression de la reservation", error)
    }
  }

  useEffect(() => {
    fetchReservations();
  }, [user]);

  return (
    <Wrapper>
      {loading ? (
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl mb-4">Mes réservations</h1>

          {reservations.length === 0 ? (
            <p>Vous n'avez pas de réservation en cours.</p>
          ) : (
            <ul className="grid md:grid-cols-2 gap-4">
              {reservations.map((reservation) => (
                <li
                  key={reservation.id}
                  className="flex items-center mb-5 border border-base-300 p-5 rounded-2xl w-full h-60"
                >
                  <Image
                    src={
                      reservation.room.imgUrl
                        ? reservation.room.imgUrl
                        : "/pexels.jpg"
                    }
                    alt={reservation.room.name}
                    width={400}
                    height={400}
                    quality={100}
                    className="shadow-sm w-1/3 h-full object-cover rounded-xl"
                  ></Image>

                  <div className="ml-6">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="badge badge-secondary">
                        <Users className="w-4 mr-2" />
                        {reservation.room.capacity}
                      </div>

                      <h1 className="font-bold text-xl ml-2">
                        {reservation.room.name}
                      </h1>
                    </div>

                    <div className="my-2">
                      <p className="flex">
                        <CalendarDays className="w-4 text-secondary" />
                        <span className="ml-1">
                          {reservation.reservationDate}
                        </span>
                      </p>

                      <p className="flex">
                        <Clock3 className="w-4 text-secondary" />
                        <span className="ml-1">
                          {reservation.startTime} - {reservation.endTime}
                        </span>
                      </p>

                      <button
                        className="btn btn-outline btn-secondary btn-sm mt-2"
                        onClick={() => deleteRervation(reservation.id)}
                      >
                        Libérer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Wrapper>
  );
};

export default page;
