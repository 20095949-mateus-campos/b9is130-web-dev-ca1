import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiPlus, FiArrowLeft } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const AdminCatalog = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importingId, setImportingId] = useState(null);

  const [prices, setPrices] = useState({});
  const [stocks, setStocks] = useState({});

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/admin/discogs/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      alert("Error searching Discogs");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (discogsId) => {
    const price = prices[discogsId];
    const stock = stocks[discogsId];

    if (!price || !stock) {
      alert("Please set a price and stock quantity before importing.");
      return;
    }

    setImportingId(discogsId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/admin/records/import/${discogsId}?price=${price}&stock=${stock}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Import failed");
      }

      alert("Record successfully added to your store!");

      setResults(results.filter((r) => r.id !== discogsId));
    } catch (err) {
      alert(err.message);
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="page-container max-w-6xl mx-auto p-6">
      <button 
        onClick={() => navigate("/profile")}
        className="secondary-btn mb-6 flex items-center gap-2"
      >
        <FiArrowLeft /> Back to Profile
      </button>

      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2">Inventory Management</h1>
        <p className="text-gray-500">Search Discogs to import new releases into your shop.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl mx-auto mb-12">
        <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-black">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            className="w-full outline-none"
            placeholder="Search album title or artist..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

    <p className="text-sm text-gray-500 mb-6 px-2">
    Showing {results.length} results from Discogs
    </p>

      <div className="admin-grid">
        {results.map((item) => (
          <div 
              onClick={console.log(item.id)}
            key={item.id} 
            className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
          >
            <div className="w-full aspect-square bg-gray-100 relative overflow-hidden">
              <img 
                src={item.cover_image || item.thumb} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-sm font-bold text-gray-900 line-clamp-2 h-10 mb-1 leading-tight">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                {item.year || "N/A"} • {item.format?.[0] || "Release"}
              </p>

              <div className="mt-auto pt-2 border-t border-gray-50">
                <div className="flex gap-2 mb-3">
                  <div className="flex-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Price €</span>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-black outline-none"
                      placeholder="20.00"
                      onChange={(e) => setPrices({...prices, [item.id]: e.target.value})}
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Stock</span>
                    <input 
                      type="number" 
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-black outline-none"
                      placeholder="1"
                      onChange={(e) => setStocks({...stocks, [item.id]: e.target.value})}
                    />
                  </div>
                </div>

                <button 
                  onClick={() => handleImport(item.id)}
                  disabled={importingId === item.id}
                  className={`w-full py-2 rounded text-xs font-bold transition ${
                    importingId === item.id 
                      ? "bg-gray-100 text-gray-400" 
                      : "bg-black text-white hover:bg-gray-800"
                  }`}
                >
                  {importingId === item.id ? "IMPORTING..." : "ADD TO CATALOG"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && !loading && (
        <div className="text-center py-20 text-gray-400">
          <p>No results yet. Enter an album name above to start building your catalog.</p>
        </div>
      )}
    </div>
  );
};

export default AdminCatalog;