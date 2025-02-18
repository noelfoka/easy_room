/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import Wrapper from "../components/Wrapper";


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
  
  return (
    <Wrapper>
      {loading ? (
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : ()}
    </Wrapper>
  );
};

export default page;
