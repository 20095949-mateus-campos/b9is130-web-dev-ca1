import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useWishlist } from "../context/WishlistContext";

const WishlistSidebar = ({ isOpen, onClose }) => {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <>
      {/* BACKDROP */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.35)",
            zIndex: 200,
          }}
        />
      )}

      {/* SIDEBAR */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "420px",
          height: "100vh",
          background: "#ffffff",
          zIndex: 300,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          boxShadow: "12px 0 40px rgba(0,0,0,0.25)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: "-40px",
            width: "40px",
            height: "100%",
            background: "linear-gradient(to right, rgba(0,0,0,0.25), transparent)",
            pointerEvents: "none",
          }}
        />

        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 1.2rem",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <h2 style={{ fontSize: "28px", fontWeight: 600 }}>
            Wishlist
          </h2>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "32px",
            }}
          >
            <IoClose />
          </button>
        </div>

        {/* COUNT */}
        <div
          style={{
            padding: "1.2rem 1.5rem",
            background: "#f5f5f5",
            fontSize: "18px",
          }}
        >
          {wishlist.length} Product(s)
        </div>

        {/* CONTENT */}
        <div
          style={{
            padding: "1.5rem",
            overflowY: "auto",
            height: "calc(100vh - 145px)",
          }}
        >
          {wishlist.length === 0 ? (
            <div style={{ textAlign: "center", marginTop: "4rem" }}>
              <p style={{ fontSize: "18px", fontWeight: 600 }}>
                Your wishlist is empty
              </p>

              <button
                onClick={onClose}
                style={{
                  marginTop: "1rem",
                  background: "black",
                  color: "white",
                  padding: "0.8rem 1.5rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "white",
                  borderRadius: "10px",
                  padding: "1rem",
                  marginBottom: "1.2rem",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <div style={{ display: "flex", gap: "1rem" }}>
                  <img
                    src={item.cover_image}
                    alt={item.title}
                    style={{
                      width: "90px",
                      height: "90px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.title}
                    </p>

                    <p
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        marginTop: "0.3rem",
                      }}
                    >
                      {item.description}
                    </p>

                    <p
                      style={{
                        fontSize: "16px",
                        fontWeight: 500,
                        marginTop: "0.5rem",
                      }}
                    >
                      €{item.price}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.8rem", marginTop: "1rem" }}>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    style={{
                      width: "40px",
                      height: "40px",
                      border: "1px solid #d1d5db",
                      background: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <RiDeleteBin6Line size={22} />
                  </button>

                  <Link
                    to={`/record/${item.id}`}
                    onClick={onClose}
                    style={{
                      flex: 1,
                      background: "black",
                      color: "white",
                      textAlign: "center",
                      height: "40px",
                      padding: "7px",
                      fontWeight: 500,
                      textDecoration: "none",
                    }}
                  >
                    VIEW PRODUCT
                  </Link>
                </div>
              </div>
            ))
          )}

          {/* FOOTER LINK */}
          {wishlist.length > 0 && (
            <Link
              to="/wishlist"
              onClick={onClose}
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "1.5rem",
                textDecoration: "underline",
              }}
            >
              View full wishlist
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

export default WishlistSidebar;