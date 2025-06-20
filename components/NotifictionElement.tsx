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
import io from 'socket.io-client';

import { useNotificationStore } from '@/app/_zustand/useNotification';



const socket = io('http://localhost:3001');

interface Notification {
  id: number;
  order_id: number;
  customer_name: string;
  status: string;
  total: number;
  created_at: string;
}

const NotificationElement = () => {

  const notifications = useNotificationStore((state) => state.notifications);
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const addNotification = useNotificationStore((state) => state.addNotification);
  
  useEffect(() => {
    fetch('http://localhost:3001/api/notifications')
      .then((res) => res.json())
      .then((data) => setNotifications(data));
  }, []);

    useEffect(() => {
        socket.on('orderStatusChanged', (data) => {
          addNotification(
            {
              id: Date.now(),
              order_id: data.orderId,
              customer_name: data.customer,
              status: data.newStatus,
              total: data.total,
              created_at: new Date().toLocaleString(),
            },
          );
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