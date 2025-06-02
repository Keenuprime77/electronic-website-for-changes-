"use client";
import { CustomButton, SectionTitle } from "@/components";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useProductStore } from "../_zustand/store";

const RegisterPage = () => {

  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    // chechking if user has already registered redirect to home page
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const firstname = e.target.firstname.value;
    const lastname = e.target.lastname.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmpassword.value;
    const address = e.target.address.value;
    const phone = e.target.phone.value;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      toast.error("Email is invalid");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password is invalid");
      toast.error("Password is invalid");
      return;
    }

    if (confirmPassword !== password) {
      setError("Passwords are not equal");
      toast.error("Passwords are not equal");
      return;
    }

    try {
      // sending API request for registering user
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password,
          address,
          phone,
        }),
      });

      if (res.status === 400) {
        toast.error("This email is already registered");
        setError("The email already in use");
      }
      if (res.status === 200) {
        setError("");
        toast.success("Registration successful");
        router.push("/login");
      }
    } catch (error) {
      toast.error("Error, try again");
      setError("Error, try again");
      console.log(error);
    }
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  // const [error, setError] = useState("");

  // const { data: session, status: sessionStatus } = useSession();

  // // useEffect(() => {
  // //   // chechking if user has already registered redirect to home page
  // //   if (sessionStatus === "authenticated") {
  // //     router.replace("/");
  // //   }
  // // }, [router, sessionStatus]);


  // const [checkoutForm, setCheckoutForm] = useState({
  //   firstname: "",
  //   lastname: "",
  //   phone: "",
  //   email: "",
  //   password: "",
  //   confirmPassword: "",
  //   address: "",
  // });
  // const {  clearCart } = useProductStore();


  // const makePurchase = async (e: { preventDefault: () => void; }) => {
  //   e.preventDefault()
  //     // sending API request for creating a order
  //     const response = await fetch("/api/register", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         firstname: checkoutForm.firstname,
  //         lastname: checkoutForm.lastname,
  //         phone: checkoutForm.phone,
  //         email: checkoutForm.email,
  //         password:checkoutForm.password,
  //         address: checkoutForm.address,
  //       }),
  //     })
  //       .then(async (res) => {

  //         if (!res.ok) {
  //           const errorData = await res.json();
  //           throw new Error(errorData.error || 'Something went wrong');
  //         }
  //         return res.json()
  //       })
  //       .then(() => {
  //         setCheckoutForm({
  //           firstname: "",
  //           lastname: "",
  //           phone: "",
  //           email: "",
  //           password:"",
  //           confirmPassword:"",
  //           address: "",

  //         });
  //         clearCart();
  //         toast.success("Order created successfuly");

  //       }).catch(err => {
  //         alert(`Order failed: ${err.message}`);
  //         console.log(`order msg:${err.message}`)

  //       });
  //   } 


  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();
  //   const name = e.target.name.value;
  //   const lastname = e.target.lastname.value;
  //   const email = e.target.email.value;
  //   const password = e.target.password.value;
  //   const confirmPassword = e.target.confirmpassword.value;
  //   const address = e.target.address.value;
  //   const phone = e.target.phone.value;

  //   if (!isValidEmail(email)) {
  //     setError("Email is invalid");
  //     toast.error("Email is invalid");
  //     return;
  //   }

  //   if (!password || password.length < 8) {
  //     setError("Password is invalid");
  //     toast.error("Password is invalid");
  //     return;
  //   }

  //   if (confirmPassword !== password) {
  //     setError("Passwords are not equal");
  //     toast.error("Passwords are not equal");
  //     return;
  //   }

  //   try {
  //     // sending API request for registering user
  //     const res = await fetch("/api/register", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         name,
  //         lastname,
  //         email,
  //         password,
  //         address,
  //         phone,
  //       }),
  //     });

  //     if (res.status === 400) {
  //       toast.error("This email is already registered");
  //       setError("The email already in use");
  //     }
  //     if (res.status === 200) {
  //       setError("");
  //       toast.success("Registration successful");
  //       router.push("/login");
  //     }
  //   } catch (error) {
  //     toast.error("Error, try again");
  //     setError("Error, try again");
  //     console.log(error);
  //   }
  // };

  // if (sessionStatus === "loading") {
  //   return <h1>Loading...</h1>;
  // }

  return (
    <div className="bg-white">
      <SectionTitle title="Register" path="Home | Register" />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-white">
        <div className="flex justify-center flex-col items-center">
          <h2 className="mt-6 text-center text-2xl leading-9 tracking-tight text-gray-900">
            Sign up on our website
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit} >
              <div>
                <label
                  htmlFor="firstname"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                 First Name
                </label>
                <div className="mt-2">
                  <input
                    id="firstname"
                    name="firstname"
                   
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
                  Last Name
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
                    
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmpassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm password
                </label>
                <div className="mt-2">
                  <input
                    id="confirmpassword"
                    name="confirmpassword"
                    type="password"
                    autoComplete="current-password"
                   
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
                    type="address"
                    autoComplete="address"
                 
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
                    type="phone"
                    autoComplete="phone"
                    required
                    
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 text-gray-900"
                  >
                    Accept our terms and privacy policy
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handleSubmit}

                  className="w-full rounded-md border border-transparent bg-secondary px-20 py-2 text-lg font-medium text-tertiary shadow-sm hover:bg-tertiary hover:border-secondary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last"
                >submit</button>
                <CustomButton
                  buttonType="submit"
                  text="Sign up"
                  paddingX={3}
                  paddingY={1.5}
                  customWidth="full"
                  textSize="sm"
                />

                <p className="text-red-600 text-center text-[16px] my-4">
                  {error && error}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

}

export default RegisterPage;
