// *********************
// Role of the component: Cart icon and quantity that will be located in the header
// Name of the component: CartElement.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CartElement />
// Input parameters: no input parameters
// Output: Cart icon and quantity
// *********************

"use client";
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaBell } from 'react-icons/fa6'
import { useProductStore } from "@/app/_zustand/store";
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

interface OrderNotification {
  orderId: number;
  newStatus: string;
  name: string;
  total: number;
}

const NotificationElement = () => {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);

    useEffect(() => {
      socket.on('orderStatusChanged', (data: OrderNotification) => {
        setNotifications((prev) => [...prev, data]);
      });
  
      return () => {
        socket.off('orderStatusChanged');
      };
    }, []);
  return (
    <div className="relative active:animate-pop">
            <Link href="/Notification">
            <div className='pt-[6px]'>

              <FaBell className="text-2xl text-black" />
            </div>
              <span className="block  w-6 h-6 bg-primary text-white rounded-full flex justify-center items-center absolute top-[-17px] right-[-22px]">
                { notifications.length }
              </span>
            </Link>
          </div>
  )
}

export default NotificationElement