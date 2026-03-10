import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import { selectAuthToken } from "../store/slices/authSlice";
import {
  clearCart,
  fetchCart,
  placeOrderFromCart,
  removeItemFromCart,
  selectCart,
  selectCartError,
  selectCartStatus,
  selectCartTotalAmount,
  updateCartQuantity
} from "../store/slices/cartSlice";
import { fetchOrders } from "../store/slices/ordersSlice";

function CartPage() {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const cart = useSelector(selectCart);
  const status = useSelector(selectCartStatus);
  const error = useSelector(selectCartError);
  const totalAmount = useSelector(selectCartTotalAmount);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCart(token));
  }, [dispatch, token]);

  const handleUpdateQuantity = async (productId, quantity) => {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    try {
      await dispatch(updateCartQuantity({ token, productId, quantity })).unwrap();
    } catch (err) {
      toast.error(err.message || "Failed to update cart item");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await dispatch(removeItemFromCart({ token, productId })).unwrap();
      toast.success("Item removed");
    } catch (err) {
      toast.error(err.message || "Failed to remove item");
    }
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart(token)).unwrap();
      toast.success("Cart cleared");
    } catch (err) {
      toast.error(err.message || "Failed to clear cart");
    }
  };

  const handlePlaceOrder = async () => {
    try {
      await dispatch(placeOrderFromCart(token)).unwrap();
      dispatch(fetchOrders(token));
      toast.success("Order placed successfully");
      navigate("/orders");
    } catch (err) {
      toast.error(err.message || "Failed to place order");
    }
  };

  return (
    <section className="mx-auto w-full max-w-5xl rounded-3xl border border-white/40 bg-white/85 p-8 shadow-[0_24px_80px_-28px_rgba(15,23,42,0.35)] backdrop-blur md:p-10">
      <h1 className="text-3xl font-extrabold tracking-tight text-center text-slate-900">My Cart</h1>
      <p className="mt-2 text-center text-sm text-slate-600">Review items before placing your order.</p>

      {status === "loading" ? <p className="mt-6 text-center text-sm text-slate-600">Loading cart...</p> : null}
      {status === "failed" ? <p className="mt-6 text-center text-sm font-semibold text-rose-700">{error}</p> : null}

      {status === "succeeded" ? (
        <>
          {cart.items.length === 0 ? <p className="mt-6 text-sm text-slate-700">Your cart is empty.</p> : null}

          {cart.items.length > 0 ? (
            <div className="mt-6">
              <aside className="mx-auto w-full max-w-xs rounded-2xl border border-slate-200 bg-slate-50/90 p-4 lg:fixed lg:left-8 lg:top-32 lg:w-[320px] lg:shadow-[0_18px_60px_-30px_rgba(15,23,42,0.55)]">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-600">Summary</p>
                <p className="mt-3 text-2xl font-extrabold text-slate-900">Total: Rs. {totalAmount}</p>
                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="w-full rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                  >
                    Place Order
                  </button>
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="w-full rounded-lg bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-200"
                  >
                    Clear Cart
                  </button>
                </div>
              </aside>

              <div className="mt-8 space-y-4 lg:pl-[360px]">
                {cart.items.map((item, index) => {
                  const product = item.product;
                  if (!product) return null;

                  return (
                    <ProductCard
                      key={product._id || `${index}-${item.quantity}`}
                      product={product}
                      onAction={() => handleRemove(product._id)}
                      actionLabel="Remove from Cart"
                      actionVariant="danger"
                      variant="compact"
                    >
                      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-700">Quantity:</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 rounded-md border border-slate-300 bg-white text-base font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            -
                          </button>
                          <span className="min-w-8 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(product._id, item.quantity + 1)}
                            className="h-8 w-8 rounded-md border border-slate-300 bg-white text-base font-bold text-slate-700"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-slate-700">Subtotal: Rs. {(product.price || 0) * item.quantity}</p>
                      </div>
                    </ProductCard>
                  );
                })}
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

export default CartPage;
