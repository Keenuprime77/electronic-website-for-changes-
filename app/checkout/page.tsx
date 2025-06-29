"use client";
import { SectionTitle } from "@/components";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { useProductStore } from "../_zustand/store";
import Image from "next/image";
import { MouseEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { isValidEmailAddressFormat, isValidNameOrLastname, isValidPhoneFormat } from "@/lib/utils";
import { useSession } from 'next-auth/react';
// _app.tsx or _document.tsx (inside <Head>)
import Head from "next/head";
import { POST } from "../api/create-order/route";

declare global {
  interface Window {
    Razorpay: any;
  }
}


const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const { data: session, status } = useSession();
  const [useDefaultAddress, setUseDefaultAddress] = useState(false);

  const [user, setUser] = useState({
    address: '',
    apartment: '',
    city: '',
    country: '',
    postalCode: '',
  });

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



  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    lastname: "",
    phone: "",
    email: "",
    company: "",
    adress: "",
    apartment: "",
    city: "",
    country: "",
    postalCode: "",
    orderNotice: "",
  });
  const { products, total, clearCart } = useProductStore();
  const router = useRouter();


  const handlePayment = async () => {
  if (loading) return;
  setLoading(true);

  // ✅ Step 1: Validate all fields
  if (
    checkoutForm.name.length > 0 &&
    checkoutForm.lastname.length > 0 &&
    checkoutForm.phone.length > 0 &&
    checkoutForm.email.length > 0 &&
    checkoutForm.company.length > 0 &&
    checkoutForm.adress.length > 0 &&
    checkoutForm.apartment.length > 0 &&
    checkoutForm.city.length > 0 &&
    checkoutForm.country.length > 0 &&
    checkoutForm.postalCode.length > 0
  ) {
    if (!isValidNameOrLastname(checkoutForm.name)) {
      toast.error("You entered invalid format for name");
      setLoading(false);
      return;
    }

    if (!isValidNameOrLastname(checkoutForm.lastname)) {
      toast.error("You entered invalid format for lastname");
      setLoading(false);
      return;
    }

    if (!isValidEmailAddressFormat(checkoutForm.email)) {
      toast.error("You entered invalid format for email address");
      setLoading(false);
      return;
    }

    if (!isValidPhoneFormat(checkoutForm.phone)) {
      toast.error("You entered invalid format for phone number");
      setLoading(false);
      return;
    }

        const outOfStockProducts: string[] = [];

    for (let i = 0; i < products.length; i++) {
      const stockCheck = await fetch("/api/check-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: products[i].id,
          quantity: products[i].amount,
        }),
      });

      const stockData = await stockCheck.json();

      if (!stockCheck.ok) {
        outOfStockProducts.push(products[i].title || `Product ID: ${products[i].id}`);
      }
    }

    if (outOfStockProducts.length > 0) {
      toast.error(`Out of stock: ${outOfStockProducts.join(", ")}`);
      setLoading(false);
      return;
    }

     const tax = total / 5;
  const shipping = 5;
  const finalAmount = Math.round(total + tax + shipping)
    
    // ✅ Step 2: Create Razorpay Order
    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok)
        throw new Error(orderData.error || "Failed to create Razorpay order");

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.finalAmount,
        currency: "INR",
        name: "Singitronic",
        description: "Product Purchase",
        image: "/logo v1 red.png",
        order_id: orderData.id,
        handler: async function (response: any) {
          // ✅ Payment successful — create order
          try {
            const orderRes = await fetch("http://localhost:3001/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: checkoutForm.name,
                lastname: checkoutForm.lastname,
                phone: checkoutForm.phone,
                email: checkoutForm.email,
                company: checkoutForm.company,
                adress: checkoutForm.adress,
                apartment: checkoutForm.apartment,
                postalCode: checkoutForm.postalCode,
                status: "processing",
                total: finalAmount,
                city: checkoutForm.city,
                country: checkoutForm.country,
                orderNotice: checkoutForm.orderNotice,
                productId: products[0].id,
                quantity: products[0].amount,
              }),
            });

            if (!orderRes.ok) {
              const errorData = await orderRes.json();
              throw new Error(errorData.error || "Order save failed");
            }

            const savedOrder = await orderRes.json();
            const orderId = savedOrder.id;

            for (let i = 0; i < products.length; i++) {
              await addOrderProduct(orderId, products[i].id, products[i].amount);
            }

            setCheckoutForm({
              name: "",
              lastname: "",
              phone: "",
              email: "",
              company: "",
              adress: "",
              apartment: "",
              city: "",
              country: "",
              postalCode: "",
              orderNotice: "",
            });

            clearCart();
            toast.success("Order placed successfully!");
            router.push("/");
          } catch (err: any) {
            toast.error("Payment successful, but order saving failed.");
            console.error(err.message);
          }
        },
        prefill: {
          name: checkoutForm.name,
          email: checkoutForm.email,
          contact: checkoutForm.phone,
        },
        notes: {
          address: checkoutForm.adress,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      rzp.on("payment.failed", function (response: any) {
        toast.error("Payment failed. Please try again.");
        console.error(response.error);
      });
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    }
  } else {
    toast.error("Please fill all required fields");
  }
  setLoading(false);
};


  // ✅ Helper to save product-order relationship
  const addOrderProduct = async (
    orderId: string,
    productId: string,
    productQuantity: number
  ) => {
    await fetch("http://localhost:3001/api/order-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerOrderId: orderId,
        productId: productId,
        quantity: productQuantity,
      }),
    });
  };

 useEffect(() => {
   if (products.length === 0) {
     toast.error("You don't have items in your cart");
     router.push("/cart");
   }
 }, []);

  return (
    <div className="bg-white">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <SectionTitle title="Checkout" path="Home | Cart | Checkout" />
      {/* Background color split screen for large screens */}
      <div
        className="hidden h-full w-1/2 bg-white lg:block"
        aria-hidden="true"
      />
      <div
        className="hidden h-full w-1/2 bg-gray-50 lg:block"
        aria-hidden="true"
      />

      <main className="relative mx-auto grid max-w-screen-2xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
        <h1 className="sr-only">Order information</h1>

        <section
          aria-labelledby="summary-heading"
          className="bg-gray-50 px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 text-sm font-medium text-gray-900"
            >
              {products.map((product) => (
                <li
                  key={product?.id}
                  className="flex items-start space-x-4 py-6"
                >
                  <Image
                    src={product?.image ? `/${product?.image}` : "/product_placeholder.jpg"}
                    alt={product?.title}
                    width={80}
                    height={80}
                    className="h-20 w-20 flex-none rounded-md object-cover object-center"
                  />
                  <div className="flex-auto space-y-1">
                    <h3>{product?.title}</h3>
                    <p className="text-gray-500">x{product?.amount}</p>
                  </div>
                  <p className="flex-none text-base font-medium">
                    ${product?.price}
                  </p>
                  <p></p>
                </li>
              ))}
            </ul>

            <dl className="hidden space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900 lg:block">
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd>${total}</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Shipping</dt>
                <dd>$5</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Taxes</dt>
                <dd>${total / 5}</dd>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <dt className="text-base">Total</dt>
                <dd className="text-base">
                  ${total === 0 ? 0 : Math.round(total + total / 5 + 5)}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <form className="px-4 pt-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0" id="checkout-form" >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <section aria-labelledby="contact-info-heading">
              <h2
                id="contact-info-heading"
                className="text-lg font-medium text-gray-900"
              >
                Contact information
              </h2>

              <div className="mt-6">
                <label
                  htmlFor="name-input"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.name}
                    name="name-input"
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        name: e.target.value,
                      })
                    }
                    type="text"
                    id="name-input"
                    onKeyDown={(e) => {
                      const allowedKeys = [
                        'Backspace',
                        'Delete',
                        'ArrowLeft',
                        'ArrowRight',
                        'Tab',
                        'Home',
                        'End',
                      ];
                      const isNotLetter = /[^a-zA-Z\s]/.test(e.key);
                      if (isNotLetter) {
                        e.preventDefault();
                      }
                    }}
                    autoComplete="given-name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="mt-6 ">
                <label
                  htmlFor="lastname-input"
                  className="block text-sm font-medium text-gray-700"
                >
                  Lastname
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.lastname}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        lastname: e.target.value,
                      })
                    }
                    type="text"
                    id="lastname-input"
                    name="lastname-input"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    onKeyDown={(e) => {
                      const allowedKeys = [
                        'Backspace',
                        'Delete',
                        'ArrowLeft',
                        'ArrowRight',
                        'Tab',
                        'Home',
                        'End',
                      ];
                      const isNotLetter = /[^a-zA-Z\s]/.test(e.key);
                      if (isNotLetter) {
                        e.preventDefault();
                      }
                    }}

                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="tel"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone number
                </label>
                <div className="mt-1">
                  <PhoneInput
                    value={checkoutForm.phone}
                    defaultCountry="in"
                    disableDialCodePrefill
                    onChange={(phone) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        phone,
                      })
                    }

                    name="tel"
                    inputClassName="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    inputProps={{
                      id: "tel",

                      autoComplete: 'tel',

                      // optional but helps for consistency
                    }} />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.email}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        email: e.target.value,
                      })
                    }
                    type="email"
                    id="email-address"
                    name="email-address"
                    autoComplete="email"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </section>

            <section aria-labelledby="shipping-heading" className="mt-10">
              <h2
                id="shipping-heading"
                className="text-lg font-medium text-gray-900"
              >
                Shipping address
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="company"
                      name="company"
                      autoComplete="company"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={checkoutForm.company}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          company: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-secondary"
                    checked={useDefaultAddress}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setUseDefaultAddress(isChecked);

                      if (isChecked) {
                        setCheckoutForm((prev) => ({
                          ...prev,
                          adress: user.address,
                          apartment: user.apartment,
                          city: user.city,
                          postalCode: user.postalCode,
                          country: user.country,
                        }));
                      } else {
                        setCheckoutForm((prev) => ({
                          ...prev,
                          adress: "",
                          apartment: "",
                          city: "",
                          postalCode: "",
                          country: "",
                        }));
                      }
                    }}
                  />
                  <span className="text-sm text-gray-700">Use default address</span>
                </label>
                <div
                  className={`${useDefaultAddress ? "hidden" : "sm:col-span-3"}`}
                >
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      autoComplete="street-address"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={checkoutForm.adress}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          adress: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>



                <div className={`${useDefaultAddress ? "hidden" : "sm:col-span-3"}`}>
                  <label
                    htmlFor="apartment"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apartment, suite, etc.
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="apartment"
                      autoComplete="address-line2"
                      name="apartment"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={checkoutForm.apartment}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          apartment: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={`${useDefaultAddress ? "hidden" : "sm:col-span-3"}`}>
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city"
                      name="city"
                      autoComplete="address-level2"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={checkoutForm.city}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          city: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={`${useDefaultAddress ? "hidden" : "sm:col-span-3"}`}>
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="region"
                      name="region"
                      autoComplete="address-level1"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={checkoutForm.country}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          country: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className={`${useDefaultAddress ? "hidden" : "sm:col-span-3"}`}>
                  <label
                    htmlFor="postal-code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Postal code
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      id="postal-code"
                      name="postal-code"
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={checkoutForm.postalCode}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          postalCode: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="order-notice"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Order notice
                  </label>
                  <div className="mt-1">
                    <textarea
                      className="textarea textarea-bordered textarea-lg w-full"
                      id="order-notice"
                      name="order-notice"
                      autoComplete="order-notice"
                      value={checkoutForm.orderNotice}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          orderNotice: e.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                </div>
              </div>
            </section>

            <div className="mt-10 border-t border-gray-200 pt-6 ml-0">
              <button
                type="button"
                onClick={handlePayment}
                disabled={loading}
                className=" w-full rounded-md border border-transparent bg-secondary px-20 py-2 text-lg font-medium text-tertiary shadow-sm hover:bg-tertiary hover:border-secondary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last"
              >
                {loading ? <div
                  className="spinner"
                  role="status">
                </div> :
                  <span>
                    Pay Now
                  </span>
                }
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CheckoutPage;