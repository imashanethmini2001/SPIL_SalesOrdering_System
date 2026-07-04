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

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-6xl mx-auto bg-white border-2 border-black">
        <div className="bg-gray-200 border-b-2 border-black text-center py-1 font-semibold">
          Home
        </div>

        <div className="p-3 border-b-2 border-black">
          <button
            onClick={() => navigate("/sales-order")}
            className="border-2 border-black rounded px-8 py-1 bg-white hover:bg-gray-100"
          >
            Add New
          </button>
        </div>

        <div className="p-4">
          <table className="w-full border-2 border-black text-sm">
            <thead className="bg-gray-300">
              <tr>
                <th className="border border-black p-2">Invoice No</th>
                <th className="border border-black p-2">Invoice Date</th>
                <th className="border border-black p-2">Customer</th>
                <th className="border border-black p-2">Reference No</th>
                <th className="border border-black p-2">Total Excl</th>
                <th className="border border-black p-2">Total Tax</th>
                <th className="border border-black p-2">Total Incl</th>
              </tr>
            </thead>

            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    onDoubleClick={() => navigate(`/sales-order/${order.id}`)}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <td className="border border-black p-2">
                      {order.invoiceNo}
                    </td>

                    <td className="border border-black p-2">
                      {order.invoiceDate
                        ? order.invoiceDate.substring(0, 10)
                        : ""}
                    </td>

                    <td className="border border-black p-2">
                      {order.customerName}
                    </td>

                    <td className="border border-black p-2">
                      {order.referenceNo}
                    </td>

                    <td className="border border-black p-2 text-right">
                      {Number(order.totalExcl || 0).toFixed(2)}
                    </td>

                    <td className="border border-black p-2 text-right">
                      {Number(order.totalTax || 0).toFixed(2)}
                    </td>

                    <td className="border border-black p-2 text-right">
                      {Number(order.totalIncl || 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="border border-black p-5 text-center"
                  >
                    No sales orders available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <p className="mt-2 text-xs text-gray-500">
            Double-click an order row to edit.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;