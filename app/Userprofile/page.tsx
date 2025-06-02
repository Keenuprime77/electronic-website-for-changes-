"use client";
import React from 'react'
import {  SectionTitle } from "@/components";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { isValidEmailAddressFormat } from "@/lib/utils";
import  { useEffect, useState } from "react";


interface DashboardUserDetailsProps {
    params: { id: number };
  }

const UserProfile = ({
    params: { id },
  }: DashboardUserDetailsProps) => {
    const [userInput, setUserInput] = useState<{
        email: string;
        newPassword:string;
      }>({
        email: "",
        newPassword:"",
      });
      const router = useRouter();

    const updateUser = async () => {
        if (
          userInput.email.length > 3 
        ) {
          if (!isValidEmailAddressFormat(userInput.email)) {
            toast.error("You entered invalid email address format");
            return;
          }
    
          if (userInput.newPassword.length > 7) {
            const requestOptions = {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: userInput.email,

              }),
            };
            fetch(`http://localhost:3001/api/users/${id}`, requestOptions)
              .then((response) => {
                if (response.status === 200) {
                  return response.json();
                } else {
                  throw Error("Error while updating user");
                }
              })
              .then((data) => toast.success("User successfully updated"))
              .catch((error) => {
                toast.error("There was an error while updating user");
              });
          }
        } else {
          toast.error("For updating a user you must enter all values");
          return;
        }
      };

      useEffect(() => {
        // sending API request for a single user
        fetch(`http://localhost:3001/api/users/${id}`)
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            setUserInput({
              email: data?.email,
              newPassword:data?.email,
            });
          });
      }, [id]);

  return (
    <div className="bg-white">
      <SectionTitle title="Profile" path="Home | Profile" />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
        <div className="flex justify-center flex-col items-center">
          <h2 className="mt-6 text-center text-2xl leading-9 tracking-tight text-gray-900">
            Profile Details
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" 
            // onSubmit={handleSubmit}
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Lastname
                </label>
                <div className="mt-2">
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={userInput.email}
              onChange={(e) =>
                setUserInput({ ...userInput, email: e.target.value })
              }
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Phone
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Address
                </label>
                <div className="mt-2">
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              

             
              <div>
              <button
            type="button"
            className="block mx-auto w-full uppercase bg-secondary px-5 rounded-[44px] py-5 text-lg border border-black border-secondary font-bold text-tertiary shadow-sm hover:bg-tertiary hover:text-secondary focus:outline-none focus:ring-2"
            onClick={updateUser}
          >
            Update user
          </button>

                <p className="text-red-600 text-center text-[16px] my-4">
                  {/* {error && error} */}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
