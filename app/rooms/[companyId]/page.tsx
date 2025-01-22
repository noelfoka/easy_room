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
    </Wrapper>
  );
};

export default page;
