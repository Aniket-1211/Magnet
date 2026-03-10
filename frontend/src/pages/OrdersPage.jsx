import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderCard from "../components/OrderCard";
import { selectAuthToken } from "../store/slices/authSlice";
import { fetchOrders, selectOrders, selectOrdersError, selectOrdersStatus } from "../store/slices/ordersSlice";

function OrdersPage() {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const orders = useSelector(selectOrders);
  const status = useSelector(selectOrdersStatus);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    dispatch(fetchOrders(token));
  }, [dispatch, token]);

  return (
    <section className="mx-auto w-full max-w-5xl rounded-3xl border border-white/40 bg-white/85 p-8 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.35)] backdrop-blur md:p-10">
      <h1 className="text-center text-3xl font-extrabold tracking-tight text-slate-900">My Orders</h1>
      <p className="mt-2 text-center text-sm text-slate-600">Track all your placed orders here.</p>

      {status === "loading" ? <p className="mt-6 text-center text-sm text-slate-600">Loading orders...</p> : null}
      {status === "failed" ? <p className="mt-6 text-center text-sm font-semibold text-rose-700">{error}</p> : null}
      {status === "succeeded" && orders.length === 0 ? <p className="mt-6 text-center text-sm text-slate-700">No orders yet.</p> : null}

      {status === "succeeded" && orders.length > 0 ? (
        <div className="mt-6 grid gap-4">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default OrdersPage;
