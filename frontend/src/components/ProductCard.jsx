function ProductCard({
  product,
  onAddToCart,
  onAction,
  actionLabel = "Add to Cart",
  actionVariant = "primary",
  hideAction = false,
  variant = "default",
  children
}) {
  const fallbackImageURL = `https://picsum.photos/seed/${encodeURIComponent(
    product?._id || product?.name || "magnet"
  )}/900/900`;
  const handleAction = () => {
    if (onAction) {
      onAction(product);
      return;
    }

    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const isCompact = variant === "compact";

  const actionClass =
    actionVariant === "danger"
      ? "w-full rounded-xl border border-rose-700 bg-rose-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-rose-500"
      : "w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100";

  return (
    <article className={`group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_10px_30px_-18px_rgba(15,23,42,0.45)] transition-all duration-300 hover:shadow-[0_18px_38px_-20px_rgba(15,23,42,0.55)] ${
      isCompact ? "" : "hover:-translate-y-1"
    }`}>
      <div className={`relative overflow-hidden ${isCompact ? "h-48 sm:h-56" : ""}`}>
        <img
          src={product.imageURL}
          alt={product.name}
          onError={(event) => {
            if (event.currentTarget.src !== fallbackImageURL) {
              event.currentTarget.src = fallbackImageURL;
            }
          }}
          className={`${isCompact ? "h-full w-full" : "h-52 w-full"} object-cover transition-transform duration-500 group-hover:scale-105`}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/25 via-transparent to-transparent" />
        <p className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-700 backdrop-blur">
          {product.category}
        </p>
      </div>

      <div className={`space-y-3 p-4 sm:p-5 ${isCompact ? "" : ""}`}>
        <div className={isCompact ? "space-y-2" : ""}>
          <h3 className={`${isCompact ? "text-lg sm:text-xl" : "min-h-[3rem] text-lg"} font-extrabold leading-6 text-slate-900`}>{product.name}</h3>
          {isCompact ? <p className="text-sm text-slate-600">Category: {product.category}</p> : null}
        </div>

        <div className={`flex items-end justify-between gap-3 ${isCompact ? "" : ""}`}>
          <p className="text-xl font-extrabold text-emerald-700">Rs. {product.price}</p>
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">In stock</span>
        </div>

        <div className={isCompact ? "space-y-3 pt-1" : ""}>
          {children}

          {!hideAction ? (
            <button
              type="button"
              onClick={handleAction}
              className={actionClass}
            >
              {actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
