/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import Wrapper from "@/app/components/Wrapper";
import React, { use, useEffect, useRef, useState } from "react";
import Notification from "@/app/components/Notification";
import FileUpload from "@/app/components/FileUpload";
import { useEdgeStore } from "@/lib/edgestore";
import Image from "next/image";
import { Trash2, Users } from "lucide-react";

interface Room {
  id: string;
  name: string;
  capacity: number;
  description: string;
  imgUrl: string;
}

const page = ({ params }: { params: { companyId: string } }) => {
  const edgestore = useEdgeStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Variales d'etat
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [companyName, setCompanyName] = useState("");

  const [notification, setNotification] = useState<string>("");
  const closeNotification = () => {
    setNotification("");
  };

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!name || !capacity || !description) {
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
          imgUrl: "",
          companyId: params.companyId,
        }),
      });

      // Si la reponse est  bonne
      if (apiResponse.ok) {
        const room = await apiResponse.json();

        let imageUploadSuccess = false;
        if (file) {
          const res = await edgestore.edgestore.publicFiles.upload({
            file,
            onProgressChange: (progress) => {
              setProgress(progress);
            },
          });
          console.log("file uploaded", res.url);

          const imageResponse = await fetch("/api/rooms", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              action: "SAVE_IMAGE",
              roomId: room.roomId,
              imgUrl: res.url,
            }),
          });

          console.log("Données envoyées pour SAVE_IMAGE :", {
            action: "SAVE_IMAGE",
            roomId: room.roomId, // Vérifiez si roomId est correct
            imgUrl: res.url, // Vérifiez si res.url est valide
          });

          if (imageResponse.ok) {
            imageUploadSuccess = true;
          }
        }

        // Si l'image a été uploadée
        if (imageUploadSuccess) {
          setNotification("Salle créée avec succès et image uploadée");
        } else {
          setNotification(
            "Salle créée avec succès mais l'image n'a pas pu être uploadée"
          );
        }

        fetchRooms();
        setName("");
        setCapacity("");
        setDescription("");
        setProgress(0);
        setFile(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        const result = await apiResponse.json();
        setNotification(`${result.message}`);
      }
    } catch (error) {
      console.error(error);
      setNotification(
        "Une erreur est survenue lors de la création de la salle"
      );
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch(`/api/rooms?companyId=${params.companyId}`);

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des salles");
      }

      const data = await response.json();
      console.log("le nom de la company est : ", data);
      setRooms(data.rooms);
      setCompanyName(data.company);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setNotification(
        "Une erreur est survenue lors de la récupération des salles"
      );
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [params.companyId]);

  const handleDeleteRoom = async (roomId: string, imgUrl: string) => {
    const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cette salle ?");
    if (!confirmed) return;

    try {

      await edgestore.edgestore.publicFiles.delete({
        url: imgUrl,
      });

      const response = await fetch(`/api/rooms`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
        }),
      });

      if (response.ok) {
        setNotification("Salle supprimée avec succès");
        fetchRooms();
      } else {
        const errorData = await response.json();
        setNotification(`Une erreur est survenue lors de la suppression de la salle ${errorData.message}`);
      }
      
    } catch (error) {
      console.error("Error deleting room:", error);
      setNotification("Une erreur est survenue lors de la suppression de la salle");
    }


  };

  return (
    <Wrapper>
      {notification && (
        <Notification
          message={notification}
          onClose={closeNotification}
        ></Notification>
      )}

      {loading ? (
        <div className="text-center mt-32">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div>
          <div className="badge badge-secondary badge-outline mb-2">
            {companyName}
          </div>

          <div className="flex flex-col-reverse md:flex-row">
            <section className="w-full">
              <h1 className="text-2xl mb-4 font-bold">Liste des salles</h1>

              <ul>
                {rooms.length > 0 ? (
                  rooms.map((room) => (
                    <li
                      key={room.id}
                      className="flex flex-col md:flex-row md:items-center mb-5 border border-base-300 p-5 rounded-2xl w-full min-h-60"
                    >
                      <Image
                        src={room.imgUrl ? room.imgUrl: "/pexels.jpg"}
                        alt={room.name}
                        width={400}
                        height={400}
                        quality={100}
                        className="shadow-sm w-full mb-4 md:mb-0 md:w-1/3 md:h-full object-cover rounded-xl"
                      />

                      <div className="md:ml-4 md:w-2/3">
                        <div className="flex items-center">
                          <div className="badge badge-secondary">
                          <Users className="mr-2 w-4" />
                          {room.capacity}
                          </div>
                          <h1 className="font-bold text-xl ml-2">{room.name}</h1>
                        </div>
                          <p className="text-sm my-2 text-gray-500">{room.description}</p>
                          {/* Bouton de supression */}
                          <button className="btn mt-2 btn-secondary btn-outline btn-sm" onClick={() => handleDeleteRoom(room.id, room.imgUrl)}>
                            <Trash2 className="w-4" />
                          </button>
                      </div>

                    </li>
                  ))
                ) : (
                  <p>
                    Votre entreprise n&apos;a pas encore créé de salle de
                    réunion.
                  </p>
                )}
              </ul>
            </section>

            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <button
              className="btn my-2 btn-outline btn-secondary w-fit flex md:hidden"
              onClick={() =>
                (
                  document.getElementById("my_modal") as HTMLDialogElement
                ).showModal()
              }
            >
              Creer salle
            </button>
            <dialog id="my_modal" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <section className="w-full">
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
                          {progress > 0 && (
                            <p>
                              <progress
                                className="progress progress-secondary w-56"
                                value={progress}
                                max="100"
                              ></progress>
                              <span className="text-sm">{progress}%</span>
                            </p>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    className="btn btn-secondary btn-outline btn-sm mt-4"
                    onClick={handleUpload}
                  >
                    Créer une salle
                  </button>
                </section>
              </div>
            </dialog>

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
                      {progress > 0 && (
                        <p>
                          <progress
                            className="progress progress-secondary w-56"
                            value={progress}
                            max="100"
                          ></progress>
                          <span className="text-sm">{progress}%</span>
                        </p>
                      )}
                    </p>
                  )}
                </div>
              </div>
              <button
                className="btn btn-secondary btn-outline btn-sm mt-4"
                onClick={handleUpload}
              >
                Créer une salle
              </button>
            </section>
          </div>
        </div>
      )}
    </Wrapper>
  );
};

export default page;
