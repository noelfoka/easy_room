/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import Notification from '@/app/components/Notification'
import Wrapper from '@/app/components/Wrapper'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
// import { Room } from '@prisma/client'
import React, { useEffect, useState } from 'react'

interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string;
}

interface Reservation {
  startTime: string;
  endTime: string;
}

interface RoomData {
  room: Room;
  existingReservations: Reservation[];
}

const page = ({ params} : { params: { roomId: string } }) => {

  // recupérer l'utilisateur connecté
  const { user } = useKindeBrowserClient();
  const [selectedDate, setSelectedDate] = useState('');
  const [roomData, setRoomData] = useState<RoomData | null>(null);

  useEffect(() => {
    const today = new Date();
    const formatedDate = today.toISOString().split('T')[0];
    setSelectedDate(formatedDate);
  }, []);

  useEffect(() => {
    if(selectedDate) {
      fetchRoomData();
    }
  }, [selectedDate]);

  // Récupérer les données du backend
  const fetchRoomData = async () => {
    console.log(params.roomId, selectedDate.split(' - ').reverse().join('/'))
    try {
      const response = await fetch("/api/disponibilities", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: params.roomId,
          reservationDate: selectedDate.split('-').reverse().join('/')
        })
      });

      // Vérifier si la réponse est ok
      if (response.ok) {
        const data = await response.json();
        setRoomData(data);

        calculateAvailablesSlots(data.existingReservations);
      } else {
        console.error('Erreur lors de la récupération des salles disponibles');
      }

    } catch (error) {
      console.error(error);
    }
  }

  const calculateAvailablesSlots = (reservations: Reservation[]) => {
    // Initialiser un tableau pour stocker les heures disponibles
    const slots : string[] = [];

    // Définir les heures de travail
    const workHours = [{start: "08:00", end: "22:00"}];
  }

  // Les variables d'etat
  const [notification, setNotification] = useState<string>("");

  const closeNotification = () => {
    setNotification("");
  };

  return (
   <Wrapper>
    {notification && (
      <Notification message={notification} onClose={closeNotification}></Notification>
    )}

    <div>{roomData?.room.name}</div>
   </Wrapper>
  )
}

export default page