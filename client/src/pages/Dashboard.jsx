import {
  useEffect,
  useState,
} from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import API from "../services/api";

function Dashboard() {
  const [expenses, setExpenses] =
    useState([]);

  const [formData, setFormData] =
    useState({
      title: "",
      amount: "",
      category: "Food",
      type: "expense",
    });
  const [editingId, setEditingId] =
  useState(null);

  // Fetch Expenses
  const fetchExpenses =
    async () => {
      try {
        const { data } =
          await API.get("/expenses");

        setExpenses(data);
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle Form Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // Add Expense
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {

    if (editingId) {
      await API.put(
        `/expenses/${editingId}`,
        formData
      );

      setEditingId(null);
    } else {
      await API.post(
        "/expenses",
        formData
      );
    }

    setFormData({
      title: "",
      amount: "",
      category: "Food",
      type: "expense",
    });

    fetchExpenses();

  } catch (error) {
    console.log(error);
  }
};
  const handleEdit = (expense) => {
  setEditingId(expense._id);

  setFormData({
    title: expense.title,
    amount: expense.amount,
    category: expense.category,
    type: expense.type,
  });
};
  // Delete Expense
  const deleteExpense =
    async (id) => {
      try {
        await API.delete(
          `/expenses/${id}`
        );

        fetchExpenses();
      } catch (error) {
        console.log(error);
      }
    };

  // Totals
  const totalIncome =
    expenses
      .filter(
        (item) =>
          item.type === "income"
      )
      .reduce(
        (acc, item) =>
          acc + item.amount,
        0
      );

  const totalExpense =
    expenses
      .filter(
        (item) =>
          item.type === "expense"
      )
      .reduce(
        (acc, item) =>
          acc + item.amount,
        0
      );

  // Pie Chart Data
  const categoryData = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Entertainment",
  ].map((category) => ({
    name: category,

    value: expenses
      .filter(
        (item) =>
          item.category === category
      )
      .reduce(
        (acc, item) =>
          acc + item.amount,
        0
      ),
  }));

  // Bar Chart Data
  const incomeExpenseData = [
    {
      name: "Transactions",
      Income: totalIncome,
      Expense: totalExpense,
    },
  ];

  // Colors
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A020F0",
  ];

  return (
    <div>
      {/* Heading */}
      <h1 className="text-4xl font-bold mb-6">
        Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold">
            Income
          </h2>

          <p className="text-3xl mt-2">
            ₹ {totalIncome}
          </p>
        </div>

        <div className="bg-red-500 text-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold">
            Expenses
          </h2>

          <p className="text-3xl mt-2">
            ₹ {totalExpense}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">
            Category Breakdown
          </h2>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {categoryData.map(
                    (
                      entry,
                      index
                    ) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">
            Income vs Expense
          </h2>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={
                  incomeExpenseData
                }
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="Income"
                  fill="#22c55e"
                />

                <Bar
                  dataKey="Expense"
                  fill="#ef4444"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Add Expense Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow mb-8 grid md:grid-cols-4 gap-4"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="border p-3 rounded"
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-3 rounded"
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Shopping</option>
          <option>Bills</option>
          <option>Entertainment</option>
        </select>

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border p-3 rounded"
        >
          <option value="expense">
            Expense
          </option>

          <option value="income">
            Income
          </option>
        </select>

        <button
          className="bg-blue-600 text-white p-3 rounded md:col-span-4"
        >
          Add Transaction
        </button>
      </form>

      {/* Expense Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-left">
                Title
              </th>

              <th className="p-4 text-left">
                Amount
              </th>

              <th className="p-4 text-left">
                Category
              </th>

              <th className="p-4 text-left">
                Type
              </th>

              <th className="p-4 text-left">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {expenses.map(
              (expense) => (
                <tr
                  key={
                    expense._id
                  }
                  className="border-t"
                >
                  <td className="p-4">
                    {expense.title}
                  </td>

                  <td className="p-4">
                    ₹ {expense.amount}
                  </td>

                  <td className="p-4">
                    {expense.category}
                  </td>

                  <td className="p-4 capitalize">
                    {expense.type}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        deleteExpense(
                          expense._id
                        )
                      }
                      className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
