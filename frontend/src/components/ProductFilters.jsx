function ProductFilters({
  categories = [],
  minPrice,
  maxPrice,
  selectedCategories = new Set(),
  priceStats = { min: 0, max: 0 },
  filteredCount = 0,
  totalCount = 0,
  onMinPriceChange,
  onMaxPriceChange,
  onToggleCategory,
  onClear
}) {
  const selectedSet = selectedCategories instanceof Set ? selectedCategories : new Set(selectedCategories);

  return (
    <section className="rounded-3xl border-r-4 border-[#F4F0E4] p-6">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <h2 className="w-full text-center text-xl font-extrabold text-slate-900">Filter Products</h2>
      </div>

      <div className="mt-6 grid gap-6 rounded-2xl bg-[#F4F0E4] p-4 lg:grid-cols-[minmax(0,260px)_1fr]">
        <div className="rounded-2xl bg-[#F4F0E4] p-4 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Price Range</h3>
          <div className="mt-4 space-y-3">
            <label className="block text-sm font-semibold text-slate-700" htmlFor="min-price">
              Min price
            </label>
            <input
              id="min-price"
              type="number"
              min="0"
              value={minPrice}
              placeholder={`${priceStats.min}`}
              onChange={(event) => onMinPriceChange(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />

            <label className="block text-sm font-semibold text-slate-700" htmlFor="max-price">
              Max price
            </label>
            <input
              id="max-price"
              type="number"
              min="0"
              value={maxPrice}
              placeholder={`${priceStats.max}`}
              onChange={(event) => onMaxPriceChange(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          <div className="mt-6" >
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Categories</h3>
            <div className="mt-3 space-y-2">
              {categories.length === 0 ? (
                <p className="text-sm text-slate-500">No categories found.</p>
              ) : (
                categories.map((category) => (
                  <label key={category} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedSet.has(category)}
                      onChange={() => onToggleCategory(category)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
                    />
                    {category}
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:hidden" />
      </div>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={onClear}
          className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
        >
          Clear filters
        </button>
      </div>
    </section>
  );
}

export default ProductFilters;
