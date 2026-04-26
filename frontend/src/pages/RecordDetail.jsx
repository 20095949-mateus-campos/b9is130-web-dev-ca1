import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaRegHeart } from "react-icons/fa";
import { getRecords } from "../services/api";
import { useCart } from "../context/CartContext.jsx";
import { addToWishlistAPI, removeFromWishlistAPI, getWishlist } from "../services/api";

function RecordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [record, setRecord] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loadingCart, setLoadingCart] = useState(false);
  const [error, setError] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRecords();
      const found = data.find((r) => String(r.id) === id);
      setRecord(found);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await getWishlist();
        const exists = data.find((item) => item.id === Number(id));
        if (exists) setIsWishlisted(true);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWishlist();
  }, [id]);

  if (!record) return <div className="p-10">Loading...</div>;

  const isOutOfStock = record.stock_quantity < 1;

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/auth");
      return;
    }

    try {
      setLoadingCart(true);
      setError("");

      await addToCart(record.id, quantity);

    } catch (err) {
      setError("Failed to add item to cart");
    } finally {
      setLoadingCart(false);
    }
  };

  const handleWishlist = async () => {
    try {
      if (isWishlisted) {
        await removeFromWishlistAPI(record.id);
        setIsWishlisted(false);
      } else {
        await addToWishlistAPI(record.id);
        setIsWishlisted(true);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-[var(--color-bg)] min-h-screen pt-[5px]">

      <div className="max-w-6xl mx-auto text-sm pl-[2rem] my-[15px]">
        <Link to="/" className="underline">HOME</Link>
        <span className="mx-[5px]">/</span>
        <span className="uppercase">{record.title}</span>
      </div>

      <div className="bg-[var(--color-secondary)] p-[2rem] mx-[2rem] flex gap-[4rem]">

        <div className="w-1/2 pl-[4rem]">
          <img
            src={record.cover_image}
            className="w-full aspect-[4/3] object-cover"
          />
        </div>

        <div className="w-1/2 flex flex-col">

          <h1 className="text-3xl font-bold">{record.title}</h1>
          <p className="font-medium mb-[20px]">{record.artist}</p>

          <div className="flex items-center gap-3 mb-[20px]">
            <p className="text-[30px] font-[700]">€{record.price}</p>
          </div>

          <p className="mb-[20px]">
            <strong>GENRE:</strong> {record.genre}
          </p>
          <p className="mb-[20px]">{record.description}</p>

          {isOutOfStock ? (
            <p className="text-red-500 mb-[10px]">Out of Stock</p>
          ) : (
            <p className="text-[var(--color-accent)] font-[600] mb-[10px]">
              {record.stock_quantity} available
            </p>
          )}

          <div className="flex items-center gap-4 mb-[10px]">
            <div className="flex items-center gap-3">
              <div className="px-[5px] py-[5px] border border-[var(--color-primary)] rounded-[5px] flex items-center">

                <button
                  className={`px-[10px] text-[20px] bg-transparent border-none outline-none ${
                    quantity === 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                  }`}
                  disabled={quantity === 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  -
                </button>

                <span className="min-w-[20px] text-center">{quantity}</span>

                <button
                  className={`px-[10px] text-[20px] bg-transparent border-none outline-none ${
                    quantity >= record.stock_quantity
                      ? "opacity-30 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                  disabled={quantity >= record.stock_quantity}
                  onClick={() =>
                    setQuantity((q) => Math.min(record.stock_quantity, q + 1))
                  }
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-[var(--color-primary)] text-[var(--color-text-bright)] 
                         px-[2rem] py-[10px] mx-[2rem] rounded-[10px] cursor-pointer"
              disabled={isOutOfStock || loadingCart}
            >
              {loadingCart ? "ADDING..." : "ADD TO CART"}
            </button>

            <button
              className="flex mt-2 text-sm bg-transparent rounded-[10px]
                        border border-[var(--color-accent)] gap-[5px]
                        text-[var(--color-text)] px-[2rem] py-[10px]
                        cursor-pointer outline-none"
                        onClick={handleWishlist}
            >
              <FaRegHeart />
              <span>{isWishlisted ? "REMOVE FROM WISHLIST" : "ADD TO WISHLIST"}</span>
            </button>
          </div>

          {error && (
            <p className="text-red-500 mt-2">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecordDetail;