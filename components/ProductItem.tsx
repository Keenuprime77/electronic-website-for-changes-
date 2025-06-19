// *********************
// Role of the component: Product item component 
// Name of the component: ProductItem.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductItem product={product} color={color} />
// Input parameters: { product: Product; color: string; }
// Output: Product item component that contains product image, title, link to the single product page, price, button...
// *********************

import Image from "next/image";
import React from "react";
import Link from "next/link";
import ProductItemRating from "./ProductItemRating";

const ProductItem = ({
  product,
  color,
}: {
  product: Product;
  color: string;
}) => {
  return (
    <div className="flex flex-col justify-center  items-center gap-y-2 w-[300px] h-[400px] bg-white rounded-[51px] shadow-[0_8px_20px_rgba(0,0,0,0.20)] transition-transform transition-shadow duration-300 ease-in-out hover:shadow-lg hover:scale-105">
      <div className="">
      <Link href={`/product/${product.slug}`}>
        <Image
          src={
            product.mainImage
              ? `/${product.mainImage}`
              : "/product_placeholder.jpg"
          }
       
          width="0"
          height="0"
          sizes="100vw"
          className="w-auto h-[250px] my-[10px]"
          alt={product?.title}
        />
      </Link>
      <Link
        href={`/product/${product.slug}`}
        className="
          text-lg text-black font-semibold block flex justify-center items-center"
          
      >
        {product.title}
      </Link>
      <p
        className="
          text-lg text-black font-semibold block flex justify-center items-center"
          >
        ${product.price}
      </p>

      <ProductItemRating productRating={product?.rating}  />
      <Link
        href={`/product/${product?.slug}`}
        className="block flex justify-center items-center w-full rounded-[34px] text-tertiary uppercase bg-secondary border-2 border-secondary px-0 py-2 text-base hover:text-secondary font-bold shadow-sm hover:bg-tertiary  focus:outline-none focus:ring-2 active:animate-pop"
        >
        <p>View product</p>
      </Link>
        </div>
    </div>
  );
};

export default ProductItem;
