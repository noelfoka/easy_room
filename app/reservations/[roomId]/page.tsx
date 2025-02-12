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

  useEffect(() => {
    const today = new Date();
    const formatedDate = today.toString().split('T')[0];
    setSelectedDate(formatedDate);
  });

  // Récupérer les données du backend
  const fetchRoomData = async () => {
    try {
      const response = await fetch(`/api/rooms/${params.roomId}`);
    } catch (error) {
      console.error(error);
    }
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

    <div>Infos</div>
   </Wrapper>
  )
}

export default page