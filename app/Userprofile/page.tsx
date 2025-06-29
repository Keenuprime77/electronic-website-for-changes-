"use client";
import React from 'react'
import { SectionTitle } from "@/components";
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { isValidEmailAddressFormat } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';

const UserProfile = () => {

  const { data: session, status } = useSession();
  const [user, setUser] = useState({
    id:'',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    country: '',
    postalCode: '',
  });

  const handleUpdate = async () => {
    const res = await fetch(`http://localhost:3001/api/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });
  
    if (res.ok) {
      toast.success('Updated successfully!');
    } else {
      const errorText = await res.text();
      console.error('Update failed:', errorText);
      toast.error('Update failed!');
    }
  };
  


 
  const getUserByEmail = async () => {
    if (session?.user?.email) {
      fetch(`http://localhost:3001/api/users/email/${session?.user?.email}`, {
        cache: "no-store",
      })
        .then((response) => response.json())
        .then((data) => {
          // (data?.id);
          setUser(data)
        });
    }
  };

  useEffect(() => {
    getUserByEmail();
  }, [session?.user?.email]);




  

  return (<>
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
                  Firstname
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={user.firstname}
                    onChange={(e) => setUser({ ...user, firstname: e.target.value })}
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
                    value={user.lastname}
                    type="text"
                    required
                    onChange={(e) => setUser({ ...user, lastname: e.target.value })}
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
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    value={user.email}
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
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    value={user.phone}
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
                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                    value={user.address}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="apartment"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                    Apartment, suite, etc.
                </label>
                <div className="mt-2">
                  <input
                    id="apartment"
                    name="apartment"
                    type="text"
                    required
                    onChange={(e) => setUser({ ...user, apartment: e.target.value })}
                    value={user.apartment}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  City
                </label>
                <div className="mt-2">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    onChange={(e) => setUser({ ...user, city: e.target.value })}
                    value={user.city}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Country
                </label>
                <div className="mt-2">
                  <input
                    id="country"
                    name="country"
                    type="text"
                    required
                    onChange={(e) => setUser({ ...user, country: e.target.value })}
                    value={user.country}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="postalCode"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Postal Code
                </label>
                <div className="mt-2">
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    required
                    onChange={(e) => setUser({ ...user, postalCode: e.target.value })}
                    value={user.postalCode}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>



              <div>
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="block mx-auto w-full uppercase bg-secondary px-5 rounded-[44px] py-5 text-lg border border-black border-secondary font-bold text-tertiary shadow-sm hover:bg-tertiary hover:text-secondary focus:outline-none focus:ring-2"

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
  </>
  )
}

export default UserProfile
