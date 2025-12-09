import { useState } from "react";

interface Listing {
  id: string;
  heading: string;
  price: number;
  miles: number;
  exteriorColor: string;
  sellerCity: string;
  sellerState: string;
  sellerZip?: string;
  dealerLat?: number;
  dealerLng?: number;
  distanceMiles?: number;
  vdpUrl: string;
  photoUrls: string[];
  trim: string;
  isNew: boolean;
  isCertified: boolean;
  vin?: string;
}

interface ListingsWidgetProps {
  listings: Listing[];
  totalListings: number;
  make: string;
  model: string;
  year: number;
  onSelectListing: (listing: Listing) => void;
}

export const ListingsWidget = ({ 
  listings, 
  totalListings, 
  make, 
  model, 
  year,
  onSelectListing 
}: ListingsWidgetProps) => {
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "miles_asc" | "miles_desc">("price_asc");
  const [filterNew, setFilterNew] = useState<"all" | "new" | "used">("all");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const filteredAndSorted = listings
    .filter((listing) => {
      if (filterNew === "new") return listing.isNew;
      if (filterNew === "used") return !listing.isNew;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price_asc": return a.price - b.price;
        case "price_desc": return b.price - a.price;
        case "miles_asc": return a.miles - b.miles;
        case "miles_desc": return b.miles - a.miles;
        default: return 0;
      }
    });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Condition:</span>
            <div className="flex gap-1">
              {[
                { value: "all", label: "All" },
                { value: "new", label: "New" },
                { value: "used", label: "Used" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilterNew(option.value as typeof filterNew)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                    filterNew === option.value
                      ? "bg-gradient-to-r from-mauve to-cyan-light text-white"
                      : "bg-white/50 text-slate-600 hover:bg-white"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-1.5 rounded-lg bg-white/50 border border-slate-200 text-sm text-slate-600 focus:outline-none focus:border-mauve"
          >
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="miles_asc">Miles: Low to High</option>
            <option value="miles_desc">Miles: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-slate-600">
          Showing <span className="font-semibold text-primary">{filteredAndSorted.length}</span> of{" "}
          <span className="font-semibold text-primary">{totalListings.toLocaleString()}</span> listings
        </p>
        <a
          href={`https://www.cargurus.com/Cars/inventorylisting/viewDetailsFilterViewInventoryListing.action?zip=90210&showNegotiable=true&sortDir=ASC&sourceContext=carGurusHomePageModel&distance=100&sortType=DEAL_SCORE&entitySelectingHelper.selectedEntity=${year}+${make}+${model}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-mauve hover:underline flex items-center gap-1"
        >
          View all listings
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Listings Grid */}
      {filteredAndSorted.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSorted.map((listing) => (
            <button
              key={listing.id}
              onClick={() => onSelectListing(listing)}
              className="glass-card overflow-hidden hover:shadow-lg transition-all group text-left w-full"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-slate-100">
                {listing.photoUrls?.[0] ? (
                  <img
                    src={listing.photoUrls[0]}
                    alt={listing.heading}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x300/6366f1/ffffff?text=${make}+${model}`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-mauve/20 to-cyan-light/20">
                    <span className="text-4xl">🚗</span>
                  </div>
                )}
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {listing.isNew && (
                    <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded">
                      NEW
                    </span>
                  )}
                  {listing.isCertified && (
                    <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-medium rounded">
                      CPO
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="font-semibold text-primary line-clamp-1">{listing.heading}</p>
                {listing.trim && (
                  <p className="text-sm text-slate-500">{listing.trim}</p>
                )}
                
                <div className="flex items-baseline justify-between mt-2">
                  <p className="text-xl font-bold gradient-text">{formatPrice(listing.price)}</p>
                  <p className="text-sm text-slate-500">{listing.miles.toLocaleString()} mi</p>
                </div>

                <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                  <span>📍</span>
                  <span>
                    {listing.sellerCity}, {listing.sellerState}
                    {listing.distanceMiles !== undefined &&
                      typeof listing.distanceMiles === "number" &&
                      ` • ${listing.distanceMiles.toFixed(1)} mi`}
                  </span>
                </div>

                {listing.exteriorColor && (
                  <p className="text-sm text-slate-500 mt-1">
                    Color: {listing.exteriorColor}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <span className="flex-1 py-2 bg-gradient-to-r from-mauve to-cyan-light text-white text-sm font-medium rounded-lg text-center">
                    View Listing
                  </span>
                  {listing.vin && (
                    <span
                      className="px-3 py-2 bg-white/50 text-slate-600 text-sm font-medium rounded-lg"
                      title="Check vehicle history"
                    >
                      📜
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <p className="text-slate-600 mb-4">No listings found matching your criteria.</p>
          <button
            onClick={() => {
              setFilterNew("all");
              setSortBy("price_asc");
            }}
            className="text-mauve hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Load More / External Links */}
      <div className="glass-card p-6 text-center">
        <p className="text-slate-600 mb-4">
          Want to see more listings for the {year} {make} {model}?
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={`https://www.cars.com/shopping/results/?stock_type=all&makes[]=${make.toLowerCase()}&models[]=${make.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '_')}&year_min=${year}&year_max=${year}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-slate-700 hover:shadow-md transition-all"
          >
            Cars.com →
          </a>
          <a
            href={`https://www.autotrader.com/cars-for-sale/all-cars/${year}/${make}/${model}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-slate-700 hover:shadow-md transition-all"
          >
            AutoTrader →
          </a>
          <a
            href={`https://www.carmax.com/cars/${make.toLowerCase()}/${model.toLowerCase().replace(/\s+/g, '-')}/${year}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-slate-700 hover:shadow-md transition-all"
          >
            CarMax →
          </a>
        </div>
      </div>
    </div>
  );
};
