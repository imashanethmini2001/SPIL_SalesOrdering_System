import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function SalesOrder() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [clients, setClients] = useState([]);
  const [items, setItems] = useState([]);

  const [form, setForm] = useState({
    clientId: "",
    invoiceNo: "",
    invoiceDate: new Date().toISOString().substring(0, 10),
    referenceNo: "",
    note: "",
    address1: "",
    address2: "",
    address3: "",
    suburb: "",
    state: "",
    postCode: "",
  });

  const emptyRow = {
    itemId: "",
    itemCode: "",
    description: "",
    note: "",
    quantity: "",
    price: "",
    taxRate: "",
    exclAmount: 0,
    taxAmount: 0,
    inclAmount: 0,
  };

  const [orderItems, setOrderItems] = useState([
    { ...emptyRow },
    { ...emptyRow },
    { ...emptyRow },
  ]);

  useEffect(() => {
    loadClients();
    loadItems();

    if (id) {
      loadOrder(id);
    }
  }, [id]);

  const loadClients = async () => {
    try {
      const response = await api.get("/clients");
      setClients(response.data);
    } catch (error) {
      console.log("Client loading error", error);
      alert("Cannot load clients. Check backend.");
    }
  };

  const loadItems = async () => {
    try {
      const response = await api.get("/items");
      setItems(response.data);
    } catch (error) {
      console.log("Item loading error", error);
      alert("Cannot load items. Check backend.");
    }
  };

  const loadOrder = async (orderId) => {
    try {
      const response = await api.get(`/salesorders/${orderId}`);
      const order = response.data;

      setForm({
        clientId: order.clientId || "",
        invoiceNo: order.invoiceNo || "",
        invoiceDate: order.invoiceDate
          ? order.invoiceDate.substring(0, 10)
          : new Date().toISOString().substring(0, 10),
        referenceNo: order.referenceNo || "",
        note: order.note || "",
        address1: order.address1 || "",
        address2: order.address2 || "",
        address3: order.address3 || "",
        suburb: order.suburb || "",
        state: order.state || "",
        postCode: order.postCode || "",
      });

      const loadedItems = order.items.map((row) => ({
        itemId: row.itemId,
        itemCode: row.item?.itemCode || "",
        description: row.item?.description || "",
        note: row.note || "",
        quantity: row.quantity,
        price: row.price,
        taxRate: row.taxRate,
        exclAmount: row.exclAmount,
        taxAmount: row.taxAmount,
        inclAmount: row.inclAmount,
      }));

      setOrderItems(loadedItems.length > 0 ? loadedItems : [{ ...emptyRow }]);
    } catch (error) {
      console.log("Order loading error", error);
      alert("Cannot load order details.");
    }
  };

  const handleFormChange = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  const handleCustomerChange = (clientId) => {
    const selectedClient = clients.find(
      (client) => client.id === Number(clientId)
    );

    if (selectedClient) {
      setForm({
        ...form,
        clientId: selectedClient.id,
        address1: selectedClient.address1,
        address2: selectedClient.address2,
        address3: selectedClient.address3,
        suburb: selectedClient.suburb,
        state: selectedClient.state,
        postCode: selectedClient.postCode,
      });
    }
  };

  const calculateRow = (row) => {
    const quantity = Number(row.quantity) || 0;
    const price = Number(row.price) || 0;
    const taxRate = Number(row.taxRate) || 0;

    const exclAmount = quantity * price;
    const taxAmount = (exclAmount * taxRate) / 100;
    const inclAmount = exclAmount + taxAmount;

    return {
      ...row,
      exclAmount,
      taxAmount,
      inclAmount,
    };
  };

  const handleItemCodeChange = (index, itemId) => {
    const selectedItem = items.find((item) => item.id === Number(itemId));

    const updatedRows = [...orderItems];

    if (selectedItem) {
      updatedRows[index] = calculateRow({
        ...updatedRows[index],
        itemId: selectedItem.id,
        itemCode: selectedItem.itemCode,
        description: selectedItem.description,
        price: selectedItem.price,
      });
    }

    setOrderItems(updatedRows);
  };

  const handleDescriptionChange = (index, itemId) => {
    const selectedItem = items.find((item) => item.id === Number(itemId));

    const updatedRows = [...orderItems];

    if (selectedItem) {
      updatedRows[index] = calculateRow({
        ...updatedRows[index],
        itemId: selectedItem.id,
        itemCode: selectedItem.itemCode,
        description: selectedItem.description,
        price: selectedItem.price,
      });
    }

    setOrderItems(updatedRows);
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...orderItems];

    updatedRows[index] = calculateRow({
      ...updatedRows[index],
      [field]: value,
    });

    setOrderItems(updatedRows);
  };

  const addNewRow = () => {
    setOrderItems([...orderItems, { ...emptyRow }]);
  };

  const removeRow = (index) => {
    if (orderItems.length === 1) {
      alert("At least one item row is required.");
      return;
    }

    const updatedRows = orderItems.filter((_, rowIndex) => rowIndex !== index);
    setOrderItems(updatedRows);
  };

  const totalExcl = orderItems.reduce(
    (sum, row) => sum + Number(row.exclAmount || 0),
    0
  );

  const totalTax = orderItems.reduce(
    (sum, row) => sum + Number(row.taxAmount || 0),
    0
  );

  const totalIncl = orderItems.reduce(
    (sum, row) => sum + Number(row.inclAmount || 0),
    0
  );

  const validateForm = () => {
    if (!form.clientId) {
      alert("Please select customer.");
      return false;
    }

    if (!form.invoiceNo.trim()) {
      alert("Please enter invoice number.");
      return false;
    }

    const validItems = orderItems.filter(
      (row) => row.itemId && Number(row.quantity) > 0
    );

    if (validItems.length === 0) {
      alert("Please add at least one valid item with quantity.");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const validItems = orderItems.filter(
      (row) => row.itemId && Number(row.quantity) > 0
    );

    const payload = {
      clientId: Number(form.clientId),
      invoiceNo: form.invoiceNo,
      invoiceDate: form.invoiceDate,
      referenceNo: form.referenceNo,
      note: form.note,
      address1: form.address1,
      address2: form.address2,
      address3: form.address3,
      suburb: form.suburb,
      state: form.state,
      postCode: form.postCode,
      items: validItems.map((row) => ({
        itemId: Number(row.itemId),
        note: row.note,
        quantity: Number(row.quantity),
        price: Number(row.price),
        taxRate: Number(row.taxRate) || 0,
      })),
    };

    try {
      if (id) {
        await api.put(`/salesorders/${id}`, payload);
        alert("Sales order updated successfully.");
      } else {
        await api.post("/salesorders", payload);
        alert("Sales order saved successfully.");
      }

      navigate("/");
    } catch (error) {
      console.log("Save error", error);
      alert("Save failed. Check backend and console.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatMoney = (value) => {
    return Number(value || 0).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-7xl mx-auto bg-white border-2 border-black">
        <div className="h-7 bg-gray-100 border-b-2 border-black flex items-center">
  <div className="flex items-center gap-2 ml-2">
    {/* Plus */}
    <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
      <span className="text-[10px] text-white font-bold leading-none">
        +
      </span>
    </div>

    {/* Minus */}
    <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
      <span className="text-[11px] text-white font-bold leading-none">
        −
      </span>
    </div>

    {/* Close */}
    <div className="w-4 h-4 rounded-full bg-black flex items-center justify-center">
      <span className="text-[10px] text-white font-bold leading-none">
        ×
      </span>
    </div>
  </div>

  <div className="flex-1 text-center font-semibold text-sm pr-16">
    Sales Order
  </div>
</div>

        <div className="p-2 border-b-2 border-black flex gap-2 print:hidden">
          <button
  onClick={handleSave}
  className="flex items-center gap-2 h-8 px-3 bg-white border-2 border-black rounded-md hover:bg-gray-100 transition"
>
  <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[11px] font-bold">
    ✓
  </span>

  <span className="font-semibold text-sm text-gray-700">
    Save Order
  </span>
</button>

          <button
            onClick={handlePrint}
            className="border-2 border-black rounded px-4 py-1 bg-white hover:bg-gray-100"
          >
            Print
          </button>

          <button
            onClick={() => navigate("/")}
            className="border-2 border-black rounded px-4 py-1 bg-white hover:bg-gray-100"
          >
            Back Home
          </button>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <FormRow label="Customer Name">
                <select
                  value={form.clientId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="w-full border-2 border-black h-8 px-2"
                >
                  <option value="">Select Customer</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.customerName}
                    </option>
                  ))}
                </select>
              </FormRow>

              <FormRow label="Address 1">
                <input
                  value={form.address1}
                  onChange={(e) => handleFormChange("address1", e.target.value)}
                  className="w-full border-2 border-black h-8 px-2"
                />
              </FormRow>

              <FormRow label="Address 2">
                <input
                  value={form.address2}
                  onChange={(e) => handleFormChange("address2", e.target.value)}
                  className="w-full border-2 border-black h-8 px-2"
                />
              </FormRow>

              <FormRow label="Address 3">
                <input
                  value={form.address3}
                  onChange={(e) => handleFormChange("address3", e.target.value)}
                  className="w-full border-2 border-black h-8 px-2"
                />
              </FormRow>

              <FormRow label="Suburb">
                <input
                  value={form.suburb}
                  onChange={(e) => handleFormChange("suburb", e.target.value)}
                  className="w-full border-2 border-black h-8 px-2"
                />
              </FormRow>

              <FormRow label="State">
                <input
                  value={form.state}
                  onChange={(e) => handleFormChange("state", e.target.value)}
                  className="w-full border-2 border-black h-8 px-2"
                />
              </FormRow>

              <FormRow label="Post Code">
                <input
                  value={form.postCode}
                  onChange={(e) => handleFormChange("postCode", e.target.value)}
                  className="w-full border-2 border-black h-8 px-2"
                />
              </FormRow>
            </div>

            <div>
              <FormRow label="Invoice No.">
                <input
                  value={form.invoiceNo}
                  onChange={(e) => handleFormChange("invoiceNo", e.target.value)}
                  className="w-full border-2 border-black h-8 px-2"
                />
              </FormRow>

              <FormRow label="Invoice Date">
                <input
                  type="date"
                  value={form.invoiceDate}
                  onChange={(e) =>
                    handleFormChange("invoiceDate", e.target.value)
                  }
                  className="w-full border-2 border-black h-8 px-2"
                />
              </FormRow>

              <FormRow label="Reference No">
                <input
                  value={form.referenceNo}
                  onChange={(e) =>
                    handleFormChange("referenceNo", e.target.value)
                  }
                  className="w-full border-2 border-black h-8 px-2"
                />
              </FormRow>

              <div className="grid grid-cols-3 gap-2 mb-2">
                <label className="font-medium">Note</label>
                <textarea
                  value={form.note}
                  onChange={(e) => handleFormChange("note", e.target.value)}
                  className="col-span-2 border-2 border-black h-24 px-2 py-1"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-2 border-black text-sm">
              <thead className="bg-gray-300">
                <tr>
                  <th className="border border-black p-2">Item Code</th>
                  <th className="border border-black p-2">Description</th>
                  <th className="border border-black p-2">Note</th>
                  <th className="border border-black p-2">Quantity</th>
                  <th className="border border-black p-2">Price</th>
                  <th className="border border-black p-2">Tax</th>
                  <th className="border border-black p-2">Excl Amount</th>
                  <th className="border border-black p-2">Tax Amount</th>
                  <th className="border border-black p-2">Incl Amount</th>
                  <th className="border border-black p-2 print:hidden">Action</th>
                </tr>
              </thead>

              <tbody>
                {orderItems.map((row, index) => (
                  <tr key={index}>
                    <td className="border border-black p-1">
                      <select
                        value={row.itemId}
                        onChange={(e) =>
                          handleItemCodeChange(index, e.target.value)
                        }
                        className="w-full border border-gray-400 h-8"
                      >
                        <option value="">Select</option>
                        {items.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.itemCode}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="border border-black p-1">
                      <select
                        value={row.itemId}
                        onChange={(e) =>
                          handleDescriptionChange(index, e.target.value)
                        }
                        className="w-full border border-gray-400 h-8"
                      >
                        <option value="">Select</option>
                        {items.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.description}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="border border-black p-1">
                      <input
                        value={row.note}
                        onChange={(e) =>
                          handleRowChange(index, "note", e.target.value)
                        }
                        className="w-full border border-gray-400 h-8 px-1"
                      />
                    </td>

                    <td className="border border-black p-1">
                      <input
                        type="number"
                        value={row.quantity}
                        onChange={(e) =>
                          handleRowChange(index, "quantity", e.target.value)
                        }
                        className="w-full border border-gray-400 h-8 px-1"
                      />
                    </td>

                    <td className="border border-black p-1">
                      <input
                        type="number"
                        value={row.price}
                        onChange={(e) =>
                          handleRowChange(index, "price", e.target.value)
                        }
                        className="w-full border border-gray-400 h-8 px-1"
                      />
                    </td>

                    <td className="border border-black p-1">
                      <input
                        type="number"
                        value={row.taxRate}
                        onChange={(e) =>
                          handleRowChange(index, "taxRate", e.target.value)
                        }
                        className="w-full border border-gray-400 h-8 px-1"
                      />
                    </td>

                    <td className="border border-black p-2 text-right">
                      {formatMoney(row.exclAmount)}
                    </td>

                    <td className="border border-black p-2 text-right">
                      {formatMoney(row.taxAmount)}
                    </td>

                    <td className="border border-black p-2 text-right">
                      {formatMoney(row.inclAmount)}
                    </td>

                    <td className="border border-black p-1 text-center print:hidden">
                      <button
                        onClick={() => removeRow(index)}
                        className="border border-black px-2 rounded"
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={addNewRow}
              className="mt-3 border-2 border-black rounded px-4 py-1 bg-white hover:bg-gray-100 print:hidden"
            >
              Add Item Row
            </button>
          </div>

          <div className="mt-6 flex justify-end">
            <div className="w-full md:w-96">
              <TotalRow label="Total Excl" value={formatMoney(totalExcl)} />
              <TotalRow label="Total Tax" value={formatMoney(totalTax)} />
              <TotalRow label="Total Incl" value={formatMoney(totalIncl)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormRow({ label, children }) {
  return (
    <div className="grid grid-cols-3 gap-2 mb-2 items-center">
      <label className="font-medium">{label}</label>
      <div className="col-span-2">{children}</div>
    </div>
  );
}

function TotalRow({ label, value }) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-2 items-center">
      <label className="font-medium">{label}</label>
      <input
        value={value}
        readOnly
        className="border-2 border-black h-8 px-2 text-right"
      />
    </div>
  );
}

export default SalesOrder;