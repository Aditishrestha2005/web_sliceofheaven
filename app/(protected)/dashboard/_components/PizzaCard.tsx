"use client";

import { useRouter } from "next/navigation";
import { Pizza, pizzaImageUrl } from "@/lib/api/pizza";
import { useCart } from "@/app/(protected)/context/CartContext";

export default function PizzaCard({ pizza }: { pizza: Pizza }) {
  const router = useRouter();
  const { toggleCart, isInCart } = useCart();

  const inCart = isInCart(pizza._id);

  const onToggle = () => {
    toggleCart({
      pizzaId: pizza._id,
      name: pizza.name,
      price: pizza.price,
      image: pizza.image,
    });
  };

  const onOrderNow = () => {
    // ✅ make sure it's in cart before going checkout
    if (!inCart) {
      toggleCart({
        pizzaId: pizza._id,
        name: pizza.name,
        price: pizza.price,
        image: pizza.image,
      });
    }

    router.push("/checkout");
  };

  return (
    <div className="bg-white w-[250px] rounded-2xl border border-orange-100 shadow-sm p-5 flex flex-col items-center text-center hover:shadow-md transition">
      {/* Top Right Toggle */}
      <div className="w-full flex justify-end -mt-1">
        <button
          type="button"
          onClick={onToggle}
          className={[
            "flex items-center gap-2 rounded-full px-3 py-2 border text-xs font-bold transition",
            inCart
              ? "bg-orange-50 border-orange-300 text-orange-700"
              : "bg-white border-orange-100 text-orange-300 hover:text-orange-600 hover:bg-orange-50",
          ].join(" ")}
          aria-label={inCart ? "Remove from cart" : "Add to cart"}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="stroke-current"
          >
            <path
              d="M6 6h15l-2 9H7L6 6Z"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M6 6 5 3H2" strokeWidth="2" strokeLinecap="round" />
            <circle cx="9" cy="21" r="1" strokeWidth="2" />
            <circle cx="18" cy="21" r="1" strokeWidth="2" />
          </svg>
          <span>{inCart ? "In Cart" : "Cart"}</span>
        </button>
      </div>

      <img
        src={pizzaImageUrl(pizza.image)}
        alt={pizza.name}
        className="w-24 h-24 rounded-full object-cover mt-3"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = "/pizza.jpg";
        }}
      />

      <h3 className="mt-4 text-sm font-semibold text-orange-950">
        {pizza.name}
      </h3>

      <p className="mt-2 text-xs text-orange-900/60 line-clamp-2 min-h-[32px]">
        {pizza.description}
      </p>

      <div className="mt-4 w-full flex items-center justify-between">
        <p className="text-sm font-semibold text-orange-950">₹ {pizza.price}</p>

        <button
          className="text-xs bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-600 transition"
          type="button"
          onClick={onOrderNow} // ✅ added
        >
          Order Now
        </button>
      </div>
    </div>
  );
}