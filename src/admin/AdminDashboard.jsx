import { useEffect, useMemo, useState } from "react";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5001";

function AdminDashboard() {
  const [token, setToken] = useState(
    () =>
      localStorage.getItem(
        "byTheBrewAdminToken"
      ) || ""
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginError, setLoginError] =
    useState("");

  const [loggingIn, setLoggingIn] =
    useState(false);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingOrder, setUpdatingOrder] =
    useState(null);

  const [filter, setFilter] =
    useState("All");


  // ============================================
  // LOGOUT
  // ============================================

  const logout = () => {
    if (token) {
      fetch(`${API_URL}/api/admin/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {});
    }

    localStorage.removeItem(
      "byTheBrewAdminToken"
    );

    setToken("");
    setOrders([]);
  };


  // ============================================
  // LOGIN
  // ============================================

  const login = async (event) => {
    event.preventDefault();

    setLoginError("");

    if (!username || !password) {
      setLoginError(
        "Please enter both username and password."
      );

      return;
    }

    try {
      setLoggingIn(true);

      const response = await fetch(
        `${API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      localStorage.setItem(
        "byTheBrewAdminToken",
        data.token
      );

      setToken(data.token);

      setPassword("");
    } catch (error) {
      setLoginError(error.message);
    } finally {
      setLoggingIn(false);
    }
  };


  // ============================================
  // FETCH ORDERS
  // ============================================

  const fetchOrders = async () => {
    if (!token) return;

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          "Failed to fetch orders"
        );
      }

      const data = await response.json();

      setOrders(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  // ============================================
  // AUTO REFRESH ORDERS
  // ============================================

  useEffect(() => {
    if (!token) return;

    fetchOrders();

    const interval = setInterval(
      fetchOrders,
      10000
    );

    return () =>
      clearInterval(interval);
  }, [token]);


  // ============================================
  // UPDATE ORDER STATUS
  // ============================================

  const updateOrderStatus = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdatingOrder(orderId);

      const response = await fetch(
        `${API_URL}/api/orders/${orderId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (response.status === 401) {
        logout();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update order"
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: newStatus,
              }
            : order
        )
      );
    } catch (error) {
      console.error(
        "Error updating order:",
        error
      );

      alert(
        "Could not update the order status."
      );
    } finally {
      setUpdatingOrder(null);
    }
  };


  // ============================================
  // TODAY'S SALES
  // ============================================

  const today = new Date();

  const isToday = (dateString) => {
    if (!dateString) return false;

    const date = new Date(dateString);

    return (
      date.getFullYear() ===
        today.getFullYear() &&
      date.getMonth() ===
        today.getMonth() &&
      date.getDate() ===
        today.getDate()
    );
  };

  const todaysOrders = orders.filter(
    (order) =>
      isToday(order.createdAt)
  );

  const todaysSales =
    todaysOrders.reduce(
      (total, order) =>
        total +
        Number(order.total || 0),
      0
    );


  // ============================================
  // FILTER ORDERS
  // ============================================

  const filteredOrders = useMemo(() => {
    if (filter === "All") {
      return orders;
    }

    return orders.filter(
      (order) =>
        order.status === filter
    );
  }, [orders, filter]);


  const pendingCount =
    orders.filter(
      (order) =>
        order.status === "Pending"
    ).length;

  const preparingCount =
    orders.filter(
      (order) =>
        order.status === "Preparing"
    ).length;


  // ============================================
  // LOGIN SCREEN
  // ============================================

  if (!token) {
    return (
      <div className="admin-dashboard admin-login-page">
        <div className="admin-login-card">

          <p className="admin-small-title">
            BY THE BREW
          </p>

          <h1>Admin Login</h1>

          <p className="admin-subtitle">
            Sign in to manage café orders.
          </p>

          <form
            onSubmit={login}
            className="admin-login-form"
          >

            <label>
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(
                  event.target.value
                )
              }
              placeholder="Enter admin username"
              autoComplete="username"
            />

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
              placeholder="Enter admin password"
              autoComplete="current-password"
            />

            {loginError && (
              <p className="login-error">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="login-btn"
              disabled={loggingIn}
            >
              {loggingIn
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>
        </div>
      </div>
    );
  }


  // ============================================
  // ADMIN DASHBOARD
  // ============================================

  return (
    <div className="admin-dashboard">

      <div className="admin-header">

        <div>
          <p className="admin-small-title">
            BY THE BREW
          </p>

          <h1>
            Admin Dashboard
          </h1>

          <p className="admin-subtitle">
            Manage today's café orders
          </p>
        </div>

        <div className="admin-header-actions">

          <button
            onClick={fetchOrders}
            className="refresh-btn"
          >
            Refresh Orders
          </button>

          <button
            onClick={logout}
            className="logout-btn"
          >
            Logout
          </button>

        </div>
      </div>


      {/* STATS */}

      <div className="admin-stats">

        <div className="stat-card">
          <span>
            Total Orders
          </span>

          <strong>
            {orders.length}
          </strong>
        </div>

        <div className="stat-card">
          <span>
            Pending
          </span>

          <strong>
            {pendingCount}
          </strong>
        </div>

        <div className="stat-card">
          <span>
            Preparing
          </span>

          <strong>
            {preparingCount}
          </strong>
        </div>

        <div className="stat-card">
          <span>
            Today's Sales
          </span>

          <strong>
            ₹{todaysSales}
          </strong>
        </div>

      </div>


      {/* ORDERS */}

      <div className="orders-section">

        <div className="orders-heading">

          <div>
            <h2>
              Orders
            </h2>

            <p>
              {filteredOrders.length} order(s)
              shown
            </p>
          </div>


          {/* FILTERS */}

          <div className="order-filters">

            {[
              "All",
              "Pending",
              "Preparing",
              "Ready",
              "Completed",
            ].map((status) => (

              <button
                key={status}
                className={
                  filter === status
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setFilter(status)
                }
              >
                {status}
              </button>

            ))}

          </div>

        </div>


        {/* LOADING */}

        {loading &&
        orders.length === 0 ? (
          <p className="empty-message">
            Loading orders...
          </p>

        ) : filteredOrders.length === 0 ? (

          <p className="empty-message">
            No{" "}
            {filter === "All"
              ? ""
              : `${filter.toLowerCase()} `}
            orders found.
          </p>

        ) : (

          <div className="orders-list">

            {filteredOrders.map(
              (order) => {

                const customerName =
                  order.customer?.name ||
                  order.customerName ||
                  "Customer";

                const orderType =
                  order.customer
                    ?.orderType ||
                  order.orderType ||
                  "";

                const tableNo =
                  order.customer
                    ?.tableNo ||
                  order.tableNo ||
                  "";

                const phone =
                  order.customer?.phone ||
                  order.phone ||
                  "";

                return (

                  <div
                    className="order-card"
                    key={order._id}
                  >

                    <div className="order-top">

                      <div>

                        <span className="order-id">
                          #
                          {order._id
                            .slice(-6)
                            .toUpperCase()}
                        </span>

                        <h3>
                          {customerName}
                        </h3>

                      </div>

                      <span
                        className={`status ${String(
                          order.status ||
                            "Pending"
                        ).toLowerCase()}`}
                      >
                        {order.status ||
                          "Pending"}
                      </span>

                    </div>


                    {/* ORDER INFO */}

                    <div className="order-info">

                      {orderType && (
                        <span>
                          {orderType}
                        </span>
                      )}

                      {tableNo && (
                        <span>
                          Table {tableNo}
                        </span>
                      )}

                      {phone && (
                        <span>
                          {phone}
                        </span>
                      )}

                    </div>


                    {/* ITEMS */}

                    <div className="order-items">

                      {(order.items || []).map(
                        (item, index) => (

                          <div
                            key={
                              item._id ||
                              index
                            }
                          >

                            <span>
                              {item.name} ×{" "}
                              {item.quantity}
                            </span>

                            <span>
                              ₹
                              {Number(
                                item.price || 0
                              ) *
                                Number(
                                  item.quantity ||
                                    0
                                )}
                            </span>

                          </div>

                        )
                      )}

                    </div>


                    {/* TOTAL */}

                    <div className="order-bottom">

                      <strong>
                        Total
                      </strong>

                      <strong>
                        ₹
                        {Number(
                          order.total || 0
                        )}
                      </strong>

                    </div>


                    {/* STATUS */}

                    <div className="status-controls">

                      <label
                        htmlFor={`status-${order._id}`}
                      >
                        Update status
                      </label>

                      <select
                        id={`status-${order._id}`}
                        value={
                          order.status ||
                          "Pending"
                        }
                        disabled={
                          updatingOrder ===
                          order._id
                        }
                        onChange={(
                          event
                        ) =>
                          updateOrderStatus(
                            order._id,
                            event.target.value
                          )
                        }
                      >

                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Preparing">
                          Preparing
                        </option>

                        <option value="Ready">
                          Ready
                        </option>

                        <option value="Completed">
                          Completed
                        </option>

                      </select>

                      {updatingOrder ===
                        order._id && (

                        <span className="updating-text">
                          Updating...
                        </span>

                      )}

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </div>
    </div>
  );
}

export default AdminDashboard;