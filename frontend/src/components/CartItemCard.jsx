function CartItemCard({ item, onUpdateQuantity, onRemove }) {
  const product = item.product || {};
  const productId = product._id;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <img
          src={product.imageURL}
          alt={product.name}
          className="h-20 w-20 rounded-xl object-cover"
        />
        <div>
          <h3 className="text-base font-bold text-slate-900">{product.name}</h3>
          <p className="text-sm text-slate-600">Rs. {product.price}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor={`qty-${product._id}`} className="text-sm font-medium text-slate-700">Qty</label>
        <input
          id={`qty-${product._id}`}
          type="number"
          min="1"
          value={item.quantity}
          onChange={(event) => {
            if (productId) {
              onUpdateQuantity(productId, Number(event.target.value));
            }
          }}
          className="w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
        />
        <button
          type="button"
          onClick={() => {
            if (productId) {
              onRemove(productId);
            }
          }}
          className="rounded-lg bg-rose-100 px-3 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-200"
        >
          Remove
        </button>
      </div>
    </article>
  );
}

export default CartItemCard;
