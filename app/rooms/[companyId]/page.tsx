/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Wrapper from "@/app/components/Wrapper";
import React, { use, useState } from "react";
import Notification from "@/app/components/Notification";
import FileUpload from "@/app/components/FileUpload";
import { edgeStoreRawSdk } from "@edgestore/server/core";
import { useEdgeStore } from "@/lib/edgestore";

const page = ({ params }: { params: { companyId: string } }) => {

  const edgestore = useEdgeStore();

  // Variales d'etat
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState<number | null>(0);

  const [notification, setNotification] = useState<string>("");
  const closeNotification = () => {
    setNotification("");
  };

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  }

  const handleUpload = async () => {
    if(!name || !capacity || !description) {
      setNotification("Les informations sont incomplètes");
      return;
    }
    
    try {

      // Vérifier si la creation de la salle est possible
      const apiResponse = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "SAVE_DATA",
          name,
          capacity,
          description: description,
          imgUrl: '',
          companyId: params.companyId,
        }),
      })

      // Si la reponse est  bonne
      if (apiResponse.ok) {
        const room = await apiResponse.json();
        
        let imageUploadSuccess = false;
        if (file) {
          const res = await edgestore.publicFiles.upload({
            file,
            onprogress: (progress: React.SetStateAction<number | null>) => {
              setProgress(progress);
            }
          })
          console.log("file uploaded", res);

          const imageResponse = await fetch("/api/rooms", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "SAVE_IMAGE",
              imgUrl: res.url,
              roomId: room.id,
            }),
          });

          if (imageResponse.ok) {
            imageUploadSuccess = true;
          }
        }

        // Si l'image a été uploadée
        if (imageUploadSuccess) {

        }else {}
      }
      
    } catch (error) {
      console.error(error);
      setNotification("Une erreur est survenue lors de la création de la salle");
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

      <section className="w-[450px] ml-8 hidden md:block">
        <h1 className="text-2xl mb-4">Créer une salle</h1>

        <input
          type="text"
          value={name}
          placeholder="Nom de la salle"
          className="input input-bordered w-full mb-4"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          value={capacity}
          placeholder="Capacité de la salle"
          className="input input-bordered w-full mb-4"
          onChange={(e) => setCapacity(e.target.value)}
        />

        <textarea
          value={description}
          placeholder="Description de la salle"
          className="textarea textarea-bordered w-full mb-4"
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {/* Uploader un fichier */}
        <div>
          <div className="p-5 rounded-lg bg-secondary/5 border border-base-300">
            {/* file upload */}
            <FileUpload
              onFileChange={handleFileChange}
              accept="image/*"
              buttonLabel="Uploader une image"
            />

            {/* Afficher le fichier uploadé */}
            {file && (
              <p className="border border-base-300 p-3 mt-4 rounded-lg">
                <span className="text-sm">{file.name}</span>
              </p>
            )}
          </div>
        </div>
        <button className="btn btn-secondary btn-outline btn-sm mt-4" onClick={handleUpload}>Créer une salle</button>
      </section>
    </Wrapper>
  );
};

export default page;
