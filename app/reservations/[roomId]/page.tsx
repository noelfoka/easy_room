/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import Notification from '@/app/components/Notification'
import Wrapper from '@/app/components/Wrapper'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { Users } from 'lucide-react'
import Image from 'next/image'
// import { Room } from '@prisma/client'
import React, { useEffect, useState } from 'react'
// import { set } from 'zod'

interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string;
  imgUrl: string;
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
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [notification, setNotification] = useState<string>("");

  const closeNotification = () => {
    setNotification("");
  };

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
    // console.log(params.roomId, selectedDate.split(' - ').reverse().join('/'))
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

  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }

  const formateTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const min = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  }

  const calculateAvailablesSlots = (reservations: Reservation[]) => {
    const slots: string[] = []
    const workingHours = [{ start: '07:30', end: '22:00' }]
    const today = new Date()
    const selectedDateObj = new Date(selectedDate)

    const now = today.getHours() * 60 + today.getMinutes()

    workingHours.forEach(({ start, end }) => {
      const startTime = parseTime(start)
      const endTime = parseTime(end)

      for (let time = startTime; time < endTime; time += 30) {
        const slotStart = formateTime(time)
        const slotEnd = formateTime(time + 30)
        // console.log(slotStart + " - " + slotEnd)

        const isToday = selectedDateObj.toDateString() === today.toDateString();

        const isPastSlot = isToday && time < now;

        const isReserved = reservations.some(({startTime, endTime}) => {
          time < parseTime(endTime) && time > parseTime(startTime)
        })

        if (!isReserved && !isPastSlot) {
          slots.push(`${slotStart} - ${slotEnd}`)
        }
      }
    })
    setAvailableSlots(slots)
  }

  return (
   <Wrapper>
    {notification && (
      <Notification message={notification} onClose={closeNotification}></Notification>
    )}

    <div>
      <h1 className='text-2xl mb-4'>Réservez cette salle </h1>

      {roomData && (
        <div className='flex'>
          <div className='w-full h-fit'>
            <div className='flex'>
              <div className='md:border-base-300 md:border md:rounded-xl md:p-5 h-fit md:w-1/3'>
                <Image
                  src={roomData.room.imgUrl ? roomData.room.imgUrl : '/pexels.jpg'}
                  alt={roomData.room.name}
                  width={400}
                  height={400}
                  quality={100}
                  className='rounded-xl shadow-sm w-full h-48 object-cover'
                ></Image>

                <div className='flex items-center mt-4'>
                  <div className='badge badge-secondary'>
                    <Users className='mr-2 w-4' />
                    {roomData.room.capacity}
                  </div>
                  <h1 className='text-xl font-bold ml-2'>{roomData.room.name}</h1>
                </div>
                <p className='text-sm my-2 text-gray-500'>{roomData.room.description}</p>
              </div>

              <div className='hidden md:block ml-4 w-2/3'>
                <div className='flex'>
                  <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className='input input-bordered mb-4' />
                  {/* <button className='btn btn-secondary btn-outline ml-2'>Valider</button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
   </Wrapper>
  )
}

export default page