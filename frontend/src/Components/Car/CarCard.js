import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="relative m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
      <Link className="" to={`/car/${product._id}`}>
        <div className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl">
          {product.images && <img
            className="object-cover"
            src={product.images[0]}
            alt={product.title}
          />}
        </div>
        <div className="mt-4 px-5 pb-5">
          <h5 className="text-xl tracking-tight font-bold text-slate-900">
            {product.title}
          </h5>
          <div className="mt-2 mb-5">
            <p className="text-sm text-gray-500">
              {product.description.substring(0, 60)}...
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
