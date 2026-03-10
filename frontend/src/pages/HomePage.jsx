import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import { selectAuthToken } from "../store/slices/authSlice";
import { addItemToCart } from "../store/slices/cartSlice";
import {
  fetchProducts,
  selectProducts,
  selectProductsError,
  selectProductsStatus
} from "../store/slices/productsSlice";

function HomePage() {
  const dispatch = useDispatch();
  const token = useSelector(selectAuthToken);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);
  const products = useSelector(selectProducts);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    dispatch(fetchProducts(token));
  }, [dispatch, token]);

  const handleAddToCart = async (product) => {
    try {
      await dispatch(addItemToCart({ token, productId: product._id, quantity: 1 })).unwrap();
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      toast.error(err.message || "Failed to add item to cart");
    }
  };

  const categories = useMemo(() => {
    const unique = new Set();
    products.forEach((product) => {
      if (product?.category) {
        unique.add(product.category);
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const priceStats = useMemo(() => {
    const prices = products
      .map((product) => Number(product?.price))
      .filter((value) => Number.isFinite(value));
    if (!prices.length) {
      return { min: 0, max: 0 };
    }
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const filteredProducts = useMemo(() => {
    const min = minPrice === "" ? null : Number(minPrice);
    const max = maxPrice === "" ? null : Number(maxPrice);

    return products.filter((product) => {
      const price = Number(product?.price);
      if (!Number.isFinite(price)) return false;

      if (min !== null && price < min) return false;
      if (max !== null && price > max) return false;

      if (selectedCategories.size > 0 && !selectedCategories.has(product?.category)) {
        return false;
      }

      return true;
    });
  }, [products, minPrice, maxPrice, selectedCategories]);

  useEffect(() => {
    setCurrentPage(1);
  }, [minPrice, maxPrice, selectedCategories]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategories(new Set());
  };

  return (
    <section className="mx-auto mt-12 w-full max-w-6xl rounded-3xl border border-white/50 bg-gradient-to-r from-[#A3AB94] via-[#BAC8AB] to-[#E4ECD7] p-5 shadow-[0_16px_45px_-30px_rgba(15,23,42,0.55)] sm:p-6">
      <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900">Latest Products</h2>
      <p className="mt-1 text-center text-sm text-slate-600">Fresh picks from your catalog.</p>

        {status === "loading" ? <p className="mt-3 text-center text-sm text-slate-600">Loading products...</p> : null}
        {status === "failed" ? <p className="mt-3 text-center text-sm font-medium text-rose-700">{error}</p> : null}

      {status === "succeeded" ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ProductFilters
              categories={categories}
              minPrice={minPrice}
              maxPrice={maxPrice}
              selectedCategories={selectedCategories}
              priceStats={priceStats}
              filteredCount={filteredProducts.length}
              totalCount={products.length}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              onToggleCategory={toggleCategory}
              onClear={clearFilters}
            />
          </aside>

          <div>
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center text-sm text-slate-600">
                No products match your filters.
              </div>
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {paginatedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </div>

                {filteredProducts.length > itemsPerPage ? (
                  <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
                          page === currentPage
                            ? "bg-emerald-700 text-white"
                            : "border border-slate-300 bg-white text-slate-700"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default HomePage;
