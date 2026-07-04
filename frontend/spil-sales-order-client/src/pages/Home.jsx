import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Home() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const response = await api.get("/salesorders");
      setOrders(response.data);
    } catch (error) {
      console.log("Error loading orders:", error);
      alert("Cannot load sales orders. Check backend.");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const emptyRows = Math.max(7 - orders.length, 0);

  return (
  <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6 text-sm text-gray-700">
    
    <div className="w-[930px] bg-white border-2 border-black">
      {/* Header */}
      <div className="h-7 bg-gray-100 border-b-2 border-black flex items-center">
        <div className="flex gap-2 ml-3">
  <div className="w-3.5 h-3.5 rounded-full bg-white border border-black flex items-center justify-center">
    <span className="text-[9px] font-bold leading-none">+</span>
  </div>

  <div className="w-3.5 h-3.5 rounded-full bg-white border border-black flex items-center justify-center">
    <span className="text-[9px] font-bold leading-none">−</span>
  </div>

  <div className="w-3.5 h-3.5 rounded-full bg-white border border-black flex items-center justify-center">
    <span className="text-[9px] font-bold leading-none">×</span>
  </div>
</div>

        <h1 className="flex-1 text-center mr-16 font-semibold text-sm">
          Home
        </h1>
      </div>

      {/* Add New Row */}
      <div className="h-10 border-b-2 border-black flex items-center px-2">
        <button
          onClick={() => navigate("/sales-order")}
          className="
w-28
h-7
bg-white
border-2
border-black
rounded-md
font-semibold
text-sm
hover:bg-gray-100
transition
"
        >
          Add New
        </button>
      </div>

      {/* Table */}
      <div className="p-4">
        <table className="w-full table-fixed border-2 border-black text-sm">
          <thead>
            <tr className="h-11 bg-gray-300">
              <th className="border border-black px-2 text-left font-semibold">
                ▼ Invoice No
              </th>
              <th className="border border-black px-2 text-left font-semibold">
                ▼ Invoice Date
              </th>
              <th className="border border-black px-2 text-left font-semibold">
                ▼ Customer
              </th>
              <th className="border border-black px-2 text-left font-semibold">
                ▼ Reference No
              </th>
              <th className="border border-black px-2 text-left font-semibold">
                ▼ Total Excl
              </th>
              <th className="border border-black px-2 text-left font-semibold">
                ▼ Total Tax
              </th>
              <th className="border border-black px-2 text-left font-semibold">
                ▼ Total Incl
              </th>
            </tr>
          </thead>

          <tbody>
  {/* Orders */}
  {orders.map((order, index) => (
    <tr
      key={order.id}
      onDoubleClick={() => navigate(`/sales-order/${order.id}`)}
      className={`h-14 cursor-pointer hover:bg-gray-100 ${
        index % 2 === 0 ? "bg-white" : "bg-gray-200"
      }`}
    >
      <td className="border border-black px-2">
        {order.invoiceNo}
      </td>

      <td className="border border-black px-2">
        {order.invoiceDate
          ? order.invoiceDate.substring(0, 10)
          : ""}
      </td>

      <td className="border border-black px-2">
        {order.customerName}
      </td>

      <td className="border border-black px-2">
        {order.referenceNo}
      </td>

      <td className="border border-black px-2 text-right">
        {Number(order.totalExcl || 0).toFixed(2)}
      </td>

      <td className="border border-black px-2 text-right">
        {Number(order.totalTax || 0).toFixed(2)}
      </td>

      <td className="border border-black px-2 text-right">
        {Number(order.totalIncl || 0).toFixed(2)}
      </td>
    </tr>
  ))}

  {/* Empty Rows */}
  {[...Array(Math.max(7 - orders.length, 0))].map((_, index) => (
    <tr
      key={`empty-${index}`}
      className={`h-14 ${
        (orders.length + index) % 2 === 0
          ? "bg-white"
          : "bg-gray-200"
      }`}
    >
      <td className="border border-black px-2 text-blue-600">"</td>
      <td className="border border-black px-2 text-blue-600">"</td>
      <td className="border border-black px-2 text-blue-600">"</td>
      <td className="border border-black px-2 text-blue-600">"</td>
      <td className="border border-black px-2 text-blue-600">"</td>
      <td className="border border-black px-2 text-blue-600">"</td>
      <td className="border border-black px-2 text-blue-600">"</td>
    </tr>
  ))}
</tbody>
        </table>

        <p className="mt-4 text-sm text-gray-700">
          Double-click an order row to edit.
        </p>
      </div>
    </div>
  </div>
);
}

export default Home;