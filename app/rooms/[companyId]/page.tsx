/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Wrapper from "@/app/components/Wrapper";
import React, { useState } from "react";
import Notification from "@/app/components/Notification";
import FileUpload from "@/app/components/FileUpload";

const page = ({ params }: { params: { companyId: string } }) => {
  // Variales d'etat
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");

  const [notification, setNotification] = useState<string>("");
  const closeNotification = () => {
    setNotification("");
  };

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  }

  return (
    <Wrapper>
      {notification && (
        <Notification
          message={notification}
          onClose={closeNotification}
        ></Notification>
      )}

      <section className="w-[450px] ml-8 hidden md:block">
        <h1 className="text-2xl mb-4">Créer une salle</h1>

        <input
          type="text"
          value={name}
          placeholder="Nom de la salle"
          className="input input-bordered w-full max-w-xs mb-4"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          value={capacity}
          placeholder="Capacité de la salle"
          className="input input-bordered w-full max-w-xs mb-4"
          onChange={(e) => setCapacity(e.target.value)}
        />

        <textarea
          value={description}
          placeholder="Description de la salle"
          className="textarea textarea-bordered w-full max-w-xs mb-4"
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {/* Uploader un fichier */}
        <div>
          <div className="p-5 rounded-lg">
            {/* file upload */}
            <FileUpload
              onFileChange={handleFileChange}
              accept="image/*"
              buttonLabel="Uploader une image"
            />
          </div>
        </div>
      </section>
    </Wrapper>
  );
};

export default page;
