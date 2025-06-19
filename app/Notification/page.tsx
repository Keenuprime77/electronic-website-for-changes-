'use client';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

interface OrderNotification {
  orderId: number;
  newStatus: string;
  name: string;
  total: number;
}

export default function OrderStatusNotification() {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
 

  useEffect(() => {
    socket.on('orderStatusChanged', (data: OrderNotification) => {
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.off('orderStatusChanged');
    };
  }, []);

  
  const clearNotifications = () => setNotifications([]);

  return (
  
<div className="xl:ml-5 w-full max-xl:mt-5 ">
      <h1 className="text-3xl font-semibold text-center mb-5">Notification</h1>
      <div className="overflow-x-auto">
        <table className="table table-md table-pin-cols">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Order ID</th>
              <th>Name and country</th>
              <th>Status</th>
              <th>Subtotal</th>
              <th>Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            {
              notifications.map((order,idx) => (
                <tr key={idx}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>

                  <td>
                    <div>
                      <p className="font-bold">#{order?.orderId}</p>
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center gap-5">
                      <div>
                        <div className="font-bold">{order?.name}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-success text-white badge-sm">
                      {order?.newStatus}
                    </span>
                  </td>

                  <td>
                    <p>${order?.total}</p>
                  </td>

                 
                </tr>
              ))}
          </tbody>
         
        </table>

        <button
                onClick={clearNotifications}
                className="text-xs text-blue-600 hover:underline"
             >
              Clear All
             </button>
      </div>
    </div>








        // <span className="text-2xl">🔔</span>
        // <div className="absolute  mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
        //   <div className="p-2 max-h-64 overflow-y-auto text-sm">
        //     {notifications.length === 0 ? (
        //       <div className="text-gray-500">No new notifications</div>
        //     ) : (
        //       notifications.map((order, idx) => (
        //         <div key={idx} className="p-2 hover:bg-gray-100 border-b text-gray-800">
        //           <strong>Order #{order.orderId}</strong> for <em>{order.name}</em><br />
        //           Status: <span className="font-semibold">{order.newStatus}</span> <br />
        //           Total: ₹{order.total}
        //         </div>
        //       ))
        //     )}
        //   </div>

        //   {notifications.length > 0 && (
        //     <div className="p-2 text-right border-t">
        //       <button
        //         onClick={clearNotifications}
        //         className="text-xs text-blue-600 hover:underline"
        //       >
        //         Clear All
        //       </button>
        //     </div>
        //   )}
        // </div>
      
    
  );
}
