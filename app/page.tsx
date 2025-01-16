import { CalendarCheck } from "lucide-react";
import Image from "next/image";
import React from "react";
import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";

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
              <LoginLink className="btn btn-secondary"> Se connecter</LoginLink>
              <RegisterLink className="btn btn-secondary btn-outline ml-4">
                {" "}
                S&apos;inscrire
              </RegisterLink>
            </div>
          </div>
        </div>
      </section>

      <section className="flex justify-center items-center">
        <div className="p-5 md:p-0">
          <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-gray-900/10 md:p-4 md:rounded-2xl w-full md:w-[1200px] md:h-[990px] ">
            <Image
              src="/demo.png"
              alt="demo"
              width={1600}
              height={500}
              quality={100}
              className="rounded-md shadow-2xl ring-1 ring-gray-900/10 object-cover filter contrast-125 saturate-100 w-full h-full"
            />
          </div>
        </div>
      </section>

      <footer className="text-center items-center bg-base-200 text-base-content mt-20 py-5 px-10">
        <h1>EasyRoom &copy; 2025 - Made with ❤️ by Noel Foka</h1>
      </footer>
    </div>
  );
};

export default page;
