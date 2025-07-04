// *********************
// Role of the component: Classical hero component on home page
// Name of the component: Hero.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Hero />
// Input parameters: no input parameters
// Output: Classical hero component with two columns on desktop and one column on smaller devices
// *********************

import Image from "next/image";
import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    
    <div className="wrapper h-[700px] w-full">
    <div className=" item item1  h-[700px] w-full bg-primary max-lg:h-[900px] max-md:h-[750px]">
      <div className="grid grid-cols-3 items-center justify-items-center px-10 gap-x-10 max-w-screen-2xl mx-auto h-full max-lg:grid-cols-1 max-lg:py-10 max-lg:gap-y-10">
        <div className="flex flex-col gap-y-5 max-lg:order-last col-span-2">
          <h1 className="text-6xl text-white font-bold mb-3 max-xl:text-5xl max-md:text-4xl max-sm:text-3xl">
            THE PRODUCT OF THE FUTURE
          </h1>
          <p className="text-white max-sm:text-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor modi
            iure laudantium necessitatibus ab, voluptates vitae ullam. Officia
            ipsam iusto beatae nesciunt, consequatur deserunt minima maiores
            earum obcaecati. Optio, nam!
          </p>
          <div className="flex gap-x-1 max-lg:flex-col max-lg:gap-y-1 active:animate-pop">

            <Link href="/product/smart-watch-demo" className="bg-secondary rounded-[34px] border-2 border-primary text-tertiary font-bold px-12 py-3 max-lg:text-xl max-sm:text-lg hover:bg-tertiary hover:text-secondary ">
              BUY NOW
            </Link>
            <button className="bg-secondary border-2 ml-[3%] border-primary text-tertiary
hover:text-secondary  rounded-[34px]  font-bold px-12 py-3 max-lg:text-xl max-sm:text-lg hover:bg-tertiary">
              LEARN MORE
            </button>
          </div>
        </div>
        <Image
          src="/watch for banner.png"
          width={400}
          height={402}
          alt="smart watch"
          className="max-md:w-[300px] max-md:h-[300px] max-sm:h-[250px] max-sm:w-[250px] w-auto h-auto"
          />
      </div>
    </div>
    <div className="item item2 h-[700px] w-full bg-primary max-lg:h-[900px] max-md:h-[750px]">
      <div className="grid grid-cols-3 items-center justify-items-center px-10 gap-x-10 max-w-screen-2xl mx-auto h-full max-lg:grid-cols-1 max-lg:py-10 max-lg:gap-y-10">
        <div className="flex flex-col gap-y-5 max-lg:order-last col-span-2">
          <h1 className="text-6xl text-white font-bold mb-3 max-xl:text-5xl max-md:text-4xl max-sm:text-3xl">
            THE PRODUCT OF THE FUTURE
          </h1>
          <p className="text-white max-sm:text-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor modi
            iure laudantium necessitatibus ab, voluptates vitae ullam. Officia
            ipsam iusto beatae nesciunt, consequatur deserunt minima maiores
            earum obcaecati. Optio, nam!
          </p>
          <div className="flex gap-x-1 max-lg:flex-col max-lg:gap-y-1 active:animate-pop">

            <Link href="/product/notebook-horizon-demo" className="bg-secondary rounded-[34px] border-2 border-primary text-tertiary font-bold px-12 py-3 max-lg:text-xl max-sm:text-lg hover:bg-tertiary hover:text-secondary ">
              BUY NOW
            </Link>
            <button className="bg-secondary border-2 ml-[3%] border-primary text-tertiary
hover:text-secondary  rounded-[34px]  font-bold px-12 py-3 max-lg:text-xl max-sm:text-lg hover:bg-tertiary">
              LEARN MORE
            </button>
          </div>
        </div>
        <Image
          src="/laptop_2.png"
          width={400}
          height={402}
          alt="laptop"
          className="max-md:w-[300px] max-md:h-[300px] max-sm:h-[250px] max-sm:w-[250px] w-auto h-auto"
          />
      </div>
    </div>
    <div className="item item3 h-[700px] w-full bg-primary max-lg:h-[900px] max-md:h-[750px]">
      <div className="grid grid-cols-3 items-center justify-items-center px-10 gap-x-10 max-w-screen-2xl mx-auto h-full max-lg:grid-cols-1 max-lg:py-10 max-lg:gap-y-10">
        <div className="flex flex-col gap-y-5 max-lg:order-last col-span-2">
          <h1 className="text-6xl text-white font-bold mb-3 max-xl:text-5xl max-md:text-4xl max-sm:text-3xl">
            THE PRODUCT OF THE FUTURE
          </h1>
          <p className="text-white max-sm:text-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor modi
            iure laudantium necessitatibus ab, voluptates vitae ullam. Officia
            ipsam iusto beatae nesciunt, consequatur deserunt minima maiores
            earum obcaecati. Optio, nam!
          </p>
          <div className="flex gap-x-1 max-lg:flex-col max-lg:gap-y-1 active:animate-pop">

            <Link href="/product/wireless-headphones-demo" className="bg-secondary rounded-[34px] border-2 border-primary text-tertiary font-bold px-12 py-3 max-lg:text-xl max-sm:text-lg hover:bg-tertiary hover:text-secondary ">
              BUY NOW
            </Link>
            <button className="bg-secondary border-2 ml-[3%] border-primary text-tertiary
hover:text-secondary  rounded-[34px]  font-bold px-12 py-3 max-lg:text-xl max-sm:text-lg hover:bg-tertiary">
              LEARN MORE
            </button>
          </div>
        </div>
        <Image
          src="/headphones_1.png"
          width={400}
          height={402}
          alt="laptop"
          className="max-md:w-[300px] max-md:h-[300px] max-sm:h-[250px] max-sm:w-[250px] w-auto h-auto"
          />
      </div>
    </div>
    <div className="item item4 h-[700px] w-full bg-primary max-lg:h-[900px] max-md:h-[750px]">
      <div className="grid grid-cols-3 items-center justify-items-center px-10 gap-x-10 max-w-screen-2xl mx-auto h-full max-lg:grid-cols-1 max-lg:py-10 max-lg:gap-y-10">
        <div className="flex flex-col gap-y-5 max-lg:order-last col-span-2">
          <h1 className="text-6xl text-white font-bold mb-3 max-xl:text-5xl max-md:text-4xl max-sm:text-3xl">
            THE PRODUCT OF THE FUTURE
          </h1>
          <p className="text-white max-sm:text-sm">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor modi
            iure laudantium necessitatibus ab, voluptates vitae ullam. Officia
            ipsam iusto beatae nesciunt, consequatur deserunt minima maiores
            earum obcaecati. Optio, nam!
          </p>
          <div className="flex gap-x-1 max-lg:flex-col max-lg:gap-y-1 active:animate-pop">

            <Link href="/product/smart-phone-demo" className="bg-secondary rounded-[34px] border-2 border-primary text-tertiary font-bold px-12 py-3 max-lg:text-xl max-sm:text-lg hover:bg-tertiary hover:text-secondary ">
              BUY NOW
            </Link>
            <button className="bg-secondary border-2 ml-[3%] border-primary text-tertiary
hover:text-secondary  rounded-[34px]  font-bold px-12 py-3 max-lg:text-xl max-sm:text-lg hover:bg-tertiary">
              LEARN MORE
            </button>
          </div>
        </div>
        <Image
          src="/smart_phone_3.png"
          width={400}
          height={402}
          alt="laptop"
          className="max-md:w-[300px] max-md:h-[300px] max-sm:h-[250px] max-sm:w-[250px] w-auto h-auto"
          />
      </div>
    </div>
</div>
  );
};

export default Hero;
