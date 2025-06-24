"use client";
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


interface OrderProduct {
  id: string;
  customerOrderId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    title: string;
    mainImage: string;
    price: number;
    rating: number;
    description: string;
    manufacturer: string;
    inStock: number;
    categoryId: string;
  };
}

const YourOrderDetails = () => {
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>();
  const [order, setOrder] = useState<Order>({
    id: "",
    adress: "",
    apartment: "",
    company: "",
    dateTime: "",
    email: "",
    lastname: "",
    name: "",
    phone: "",
    postalCode: "",
    city: "",
    country: "",
    orderNotice: "",
    status: "processing",
    total: 0,
  });
  const params = useParams<{ id: string }>();

  const router = useRouter();

  useEffect(() => {
    const fetchOrderData = async () => {
      const response = await fetch(
        `http://localhost:3001/api/orders/${params?.id}`
      );
      const data: Order = await response.json();
      setOrder(data);
    };

    const fetchOrderProducts = async () => {
      const response = await fetch(
        `http://localhost:3001/api/order-product/${params?.id}`
      );
      const data: OrderProduct[] = await response.json();
      setOrderProducts(data);
    };

    fetchOrderData();
    fetchOrderProducts();
  }, [params?.id]);



  return (
    <div className="bg-white flex justify-start max-w-screen-2xl mx-auto xl:h-full max-xl:flex-col max-xl:gap-y-5">
     
      <div className="flex flex-col gap-y-7 xl:ml-5 w-full max-xl:px-5">
        <h1 className="text-3xl font-semibold">Order details</h1>
        <div className="mt-5">
          <label className="w-full">
            <div>
              <span className="text-xl font-bold">Order ID:</span>
              <span className="text-base"> {order?.id}</span>
            </div>
          </label>
        </div>
        <div className="flex gap-x-2 max-sm:flex-col">
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Name:</span>
              </div>
              <p  className='w-full max-w-xs'>{order?.name}</p>
            </label>
          </div>
          <div className='ml-[20px]'>
            <label className="form-control w-full max-w-xs">
  <div className="label justify-center"> {/* Center the label text */}
    <span className="label-text text-center">Lastname:</span>
  </div>
  <p className="text-center">{order?.lastname}</p> {/* Center the value */}
</label>

          </div>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Phone number:</span>
            </div>
          <p>{order?.phone}</p>
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Email adress:</span>
            </div>
          <p>{order?.email}</p>
          </label>
        </div>

        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">Company:</span>
            </div>
            <p>{order.company}</p>
          </label>
        </div>

        <div className="flex gap-x-2 max-sm:flex-col">
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Address:</span>
              </div>
         <p>{order?.adress}</p>
            </label>
          </div>

          <div className='ml-[20px]'>
            <label className="form-control w-full max-w-xs">
  <div className="label justify-center"> {/* Center the label text */}
    <span className="label-text text-center">Apartment, suite, etc. :</span>
  </div>
  <p className="text-center">{order?.apartment}</p> {/* Center the value */}
</label>

          </div>
        </div>

        <div className="flex gap-x-2 max-sm:flex-col">
          <div>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">City:</span>
              </div>
              <p>{order?.city}</p>
            </label>
          </div>

          <div className='ml-[20px]'>
            <label className="form-control w-full max-w-xs">
  <div className="label justify-center"> {/* Center the label text */}
    <span className="label-text text-center">Country:</span>
  </div>
  <p className="text-center">{order?.country}</p> {/* Center the value */}
</label>

          </div>

          <div className='ml-[20px]'>
            <label className="form-control w-full max-w-xs">
  <div className="label justify-center"> {/* Center the label text */}
    <span className="label-text text-center">Postal Code:</span>
  </div>
  <p className="text-center">{order?.postalCode}</p> {/* Center the value */}
</label>

          </div>
        </div>

        <div className="form-control w-full max-w-xs">
  <div className="label">
    <div className="inline-block">
      <span className="label-text">Order Status:</span>
      <div className="w-full relative">
        <p className="text-center">{order?.status}</p>
      </div>
    </div>
  </div>
</div>

        <div>
          <label className="form-control">
            <div className="label">
              <span className="label-text">Order notice:</span>
            </div>
            <p>{order?.orderNotice}</p>
          </label>
        </div>
        <div>
          {orderProducts?.map((product) => (
            <div className="flex items-center gap-x-4" key={product?.id}>
              <Image
                src={product?.product?.mainImage ? `/${product?.product?.mainImage}` : "/product_placeholder.jpg"}
                alt={product?.product?.title}
                width={50}
                height={50}
                className="w-auto h-auto"
              />
              <div>
                <Link href={`/product/${product?.product?.slug}`}>
                  {product?.product?.title}
                </Link>
                <p>
                  ${product?.product?.price} * {product?.quantity} items
                </p>
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-y-2 mt-10">
            <p className="text-2xl">Subtotal: ${order?.total}</p>
            <p className="text-2xl">Tax 20%: ${order?.total / 5}</p>
            <p className="text-2xl">Shipping: $5</p>
            <p className="text-3xl font-semibold">
              Total: ${order?.total + order?.total / 5 + 5}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourOrderDetails;
