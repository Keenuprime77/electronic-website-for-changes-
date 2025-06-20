'use client';
import { SectionTitle } from '@/components';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');
import { useNotificationStore } from '@/app/_zustand/useNotification';

interface Notification {
  id: number;
  order_id: number;
  customer_name: string;
  status: string;
  total: number;
  created_at: string;
}

export default function OrderStatusNotification() {


  const notifications = useNotificationStore((state) => state.notifications);
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const deleteNotificationFromStore = useNotificationStore((state) => state.deleteNotification);


  useEffect(() => {
    socket.on('orderStatusChanged',()=>{
      fetch('http://localhost:3001/api/notifications')
      .then((res)=>res.json())
      .then((data)=>setNotifications(data));
    });
    return()=>{socket.off('orderStatusChanged')};
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

  const deleteNotification = async (id: number) => {
    const res = await fetch(`http://localhost:3001/api/notifications/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      deleteNotificationFromStore(id);
    }
  };


  return (
    <>
      <SectionTitle title={'Notification'} path={'Home | Notification'} ></SectionTitle>
      <div className="xl:ml-5 w-full max-xl:mt-5 ">
        {notifications.length == 0 ? <h1 className="text-3xl font-semibold text-center mb-5"> No Notifications</h1> :
          <div className="overflow-x-auto">
            <table className="table table-md table-pin-cols">
              {/* head */}
              <thead>
                <tr>

                  <th>Order ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Subtotal</th>
                  <th>Date</th>

                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                {
                  notifications.map((order, idx) => (
                    <tr key={idx}>
                      <td>
                        <div>
                          <p className="font-bold">#{order?.order_id}</p>
                        </div>
                      </td>

                      <td>
                        <div className="flex items-center gap-5">
                          <div>
                            <div className="font-bold">{order?.customer_name}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="badge badge-success text-white badge-sm">
                          {order?.status}
                        </span>
                      </td>

                      <td>
                        <p>{order?.total}</p>
                      </td>

                      <td>
                        <p>{new Date(Date.parse(order?.created_at)).toLocaleString()} </p>
                      </td>
                      <td>
                        <button onClick={() => deleteNotification(order.id)} className=' rounded-md border border-transparent bg-secondary  px-10 py-2 my-1 text-md font-medium text-tertiary shadow-sm hover:bg-tertiary hover:border-secondary hover:text-secondary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-gray-50 sm:order-last'>Delete</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>}
      </div>
    </>
  );
}
