function OrderCard({ order }) {
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-600">Order #{order._id}</p>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
          {order.status}
        </span>
      </div>

      <p className="mt-2 text-sm text-slate-600">
        Placed: {new Date(order.createdAt).toLocaleString()}
      </p>
      <p className="mt-1 text-base font-bold text-emerald-700">Total: Rs. {order.totalAmount}</p>

      <div className="mt-4 space-y-2">
        {order.items.map((item) => (
          <div key={`${order._id}-${item.product}`} className="flex items-center justify-between text-sm text-slate-700">
            <span>{item.name}</span>
            <span>{item.quantity} x Rs. {item.price}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default OrderCard;
