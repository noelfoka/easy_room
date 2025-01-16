import { CalendarCheck } from "lucide-react";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="relative">
      <section
        className="w-full"
        style={{
          backgroundColor: "#ffffff",
          backgroundImage: "url('/img.jpg')",
        }}
      >
        <div className="relative hero-content text-center mx-4 lg:mx-[15%] py-20">
          <div className="max-w-lg">
            <h1 className="text-3xl md:text-7xl flex justify-center items-center">
              <div className="bg-secondary p-1 mr-1 rounded-md text-white">
                <CalendarCheck className="w-8 h-8 md:w-16 md:h-16" />
              </div>
              <span>
                Es<span className="text-secondary">Rom</span>
              </span>
            </h1>

            <h2 className="py-4 md:py-6 text-xl md:text-3xl font-semibold">
              Gérez la réservation de vos{" "}
              <span className="text-secondary">salles de réunion</span> en toute
              simplicité
            </h2>

            <ul className="steps steps-vertical lg:steps-horizontal">
              <li className="step step-secondary text-sm">
                <div className="badge">Créer un compte</div>
              </li>
              <li className="step step-secondary text-sm">
                <div className="badge">Réservez vos salles</div>
              </li>
              <li className="step step-secondary text-sm">
                <div className="badge">Créer vos réservations</div>
              </li>
            </ul>

            <div className="mt-6 flex justify-center">
              <button className="btn btn-secondary"> Se connecter</button>
              <button className="btn btn-secondary btn-outline ml-4">
                {" "}
                S&apos;inscrire
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="flex justify-center items-center">

        <div className="p-5 md:p-0">
          <div>
            <Image src="/demo.png" alt="demo" width={1600} height={500} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default page;
