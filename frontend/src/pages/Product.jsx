import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Product() {
  const { prodId } = useParams();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(false);
  const settings = {
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    lazyLoad: true,
    fade: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/product/${prodId}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        return toast.error(error.message);
      }
    };
    fetchProduct();
  }, [prodId]);

  if (loading) {
    return (
      <div className="w-full p-4 min-h-screen flex justify-center items-center">
        <Spinner size={"xl"} />
        <p className="ml-2 text-2xl">Loading...</p>
      </div>
    );
  }

  if (!loading && !product) {
    return (
      <div className="w-full p-4 min-h-screen flex justify-center items-center">
        <p className="mb-2 text-2xl">No product found!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full mx-auto p-4 max-w-lg sm:max-w-3xl md:max-w-4xl lg:max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:justify-center sm:items-start items-center gap-8 md:gap-12">
        <Slider
          {...settings}
          className="border border-gray-400 rounded-lg sm:w-1/2 w-full p-3"
        >
          {product &&
            product.images.map((imageUrl, index) => (
              <div key={index} className="w-full h-full">
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="w-auto mx-auto h-full md:max-w-80 sm:max-h-[500px] md:max-h-[500px] object-contain cursor-pointer hover:scale-105 transition-all ease-linear duration-300"
                />
              </div>
            ))}
        </Slider>
        <div className=" sm:w-1/2 w-full ">
          <div className="p-4">
            <h2 className="sm:text-3xl text-2xl border-b-2 py-2">
              {product.name}
            </h2>
            {product && product.quantity > 0 ? (
              <div className="border-b-2 py-2">
                <div className="flex">
                  <span>₹</span>
                  <h2 className="sm:text-3xl text-2xl">{product.price}</h2>
                </div>
                <p className="font-light">Inclusive of all taxes</p>
              </div>
            ) : (
              <div className="border-b-2 py-2">
                <p className="text-red-500 text-xl sm:text-2xl">
                  Out of stock !
                </p>
              </div>
            )}
            <div className="my-2 border-b-2 py-2 flex items-center">
              <h5 className="sm:text-xl text-lg mr-3">Brand:</h5>
              <p className="sm:text-lg text-base">{product.brand}</p>
            </div>
            <div className="my-2 border-b-2 py-2">
              <h5 className="sm:text-xl text-lg">Categories:</h5>
              <div className="flex flex-auto gap-2 py-2">
                {product &&
                  product.categories.map((cat, index) => (
                    <Link
                      key={index}
                      to={`/collections/${cat}`}
                      className="bg-gray-100 px-2 py-1 rounded-full"
                    >
                      {cat}
                    </Link>
                  ))}
              </div>
            </div>
            <div className="my-2 border-b-2 py-2">
              <h5 className="sm:text-xl text-lg mb-1">Description:</h5>
              <p className="sm:text-lg text-base font-light">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
