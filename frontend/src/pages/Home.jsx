import React, { useEffect, useState, lazy, Suspense, useRef, useCallback } from "react";
import Slider from "react-slick";
import MenImage from "../assets/Men.jpg";
import WomenImage from "../assets/Women.jpg";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Spinner } from "flowbite-react";
import { motion } from "framer-motion";
import { FaArrowRight, FaStar, FaHandshake, FaRocket, FaUsers } from "react-icons/fa";

// Lazy load the ProductCard component
const ProductCard = lazy(() => import("../components/ProductCard"));

function Home() {
  const [allCategories, setAllCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const MAX_PRODUCTS = 24;

  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && products.length < MAX_PRODUCTS) {
        fetchProducts(products.length);
      }
    }, {
      rootMargin: '200px'
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, products.length]);

  useEffect(() => {
    fetchAllCategories();
    fetchProducts();
  }, []);

  const fetchAllCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/category/getCategories`);
      const data = await res.json();
      if (res.ok) {
        setAllCategories(data);
        setLoading(false);
      } else {
        setLoading(false);
        console.log(data.msg);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };

  const fetchProducts = async (start = 0) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/product/search?start=${start}`);
      const data = await res.json();
      if (res.ok) {
        const newProducts = start === 0 ? data.products : [...products, ...data.products];
        setProducts(newProducts);
        // Check if we've reached the maximum or if there are no more products
        setHasMore(newProducts.length < MAX_PRODUCTS && data.products.length === 8);
      } else {
        return toast.error(data.msg);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: false,
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

  const settings2 = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <div className="w-full p-4 min-h-screen flex justify-center items-center">
        <Spinner size={"xl"} />
        <p className="ml-2 text-2xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[30vh] sm:h-[80vh] overflow-hidden">
        <Slider {...settings} className=" sm:h-3/5 md:h-full">
          <div className="relative h-full">
            <img 
              src={MenImage} 
              alt="Men's Collection" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center text-white max-w-2xl mx-auto"
              >
                <p className="text-lg sm:text-xl mb-4 sm:mb-8">Discover the latest trends in men's fashion</p>
                <Link 
                  to="/collections/Men" 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-2 mx-auto w-fit text-sm sm:text-base"
                >
                  Shop Now <FaArrowRight />
                </Link>
              </motion.div>
            </div>
          </div>
          <div className="relative h-full">
            <img 
              src={WomenImage} 
              alt="Women's Collection" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40 flex items-center justify-center px-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center text-white max-w-2xl mx-auto"
              >
                <p className="text-lg sm:text-xl mb-4 sm:mb-8">Explore our exclusive women's fashion line</p>
                <Link 
                  to="/collections/Women" 
                  className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:from-pink-600 hover:to-pink-700 transition-all flex items-center gap-2 mx-auto w-fit text-sm sm:text-base"
                >
                  Shop Now <FaArrowRight />
                </Link>
              </motion.div>
            </div>
          </div>
        </Slider>
      </div>

      {/* Vision Section */}
      <div className="py-12 sm:py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">Our Vision</h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
              To revolutionize the fashion industry by providing sustainable, high-quality products while maintaining affordability and style.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FaStar className="text-3xl text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Quality First</h3>
              <p className="text-gray-600 text-center">
                We believe in delivering the highest quality products that stand the test of time.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FaHandshake className="text-3xl text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Customer Trust</h3>
              <p className="text-gray-600 text-center">
                Building lasting relationships with our customers through transparency and reliability.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FaRocket className="text-3xl text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">Innovation</h3>
              <p className="text-gray-600 text-center">
                Constantly pushing boundaries to bring you the latest in fashion technology and design.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To provide exceptional fashion experiences while maintaining our commitment to sustainability and ethical practices. We strive to make high-quality fashion accessible to everyone.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaUsers className="text-xl text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Community Focus</h3>
                  <p className="text-gray-600">
                    We actively engage with our community to understand their needs and preferences, ensuring we deliver products that truly resonate with our customers.
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-gray-50 p-8 rounded-xl"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaHandshake className="text-xl text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Ethical Practices</h3>
                  <p className="text-gray-600">
                    We maintain strict ethical standards in our supply chain, ensuring fair wages and safe working conditions for all our partners.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-12 sm:py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">Shop by Categories</h2>
            <p className="text-base sm:text-lg text-gray-600">Discover our wide range of collections</p>
          </motion.div>
          <div className="mt-4 sm:mt-8">
            <Slider {...settings2}>
              {allCategories && allCategories.map((cat, index) => {
                const colorCombinations = [
                  { bg: 'bg-gradient-to-br from-blue-500 to-blue-600', text: 'text-white' },
                  { bg: 'bg-gradient-to-br from-purple-500 to-purple-600', text: 'text-white' },
                  { bg: 'bg-gradient-to-br from-pink-500 to-pink-600', text: 'text-white' },
                  { bg: 'bg-gradient-to-br from-indigo-500 to-indigo-600', text: 'text-white' },
                  { bg: 'bg-gradient-to-br from-teal-500 to-teal-600', text: 'text-white' },
                  { bg: 'bg-gradient-to-br from-rose-500 to-rose-600', text: 'text-white' },
                  { bg: 'bg-gradient-to-br from-cyan-500 to-cyan-600', text: 'text-white' },
                ];
                const colors = colorCombinations[index % colorCombinations.length];

                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="px-1 sm:px-2"
                  >
                    <Link
                      to={`/collections/${cat.name}`}
                      className={`block ${colors.bg} rounded-full aspect-square w-16 sm:w-24 h-16 sm:h-24 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 p-2 sm:p-4`}
                    >
                      <h3 className={`text-xs sm:text-sm font-semibold ${colors.text} text-center`}>
                        {cat.name}
                      </h3>
                    </Link>
                  </motion.div>
                );
              })}
            </Slider>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Recently Added</h2>
            <p className="text-lg text-gray-600">Discover our latest arrivals</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <Suspense fallback={<div className="text-center">Loading products...</div>}>
              {products.map((prod, index) => {
                // Check if this is the last product in the current row
                const isLoadTrigger = (index + 1) % 4 === 0 && index === products.length - 1;
                
                return (
                  <motion.div
                    key={index}
                    ref={isLoadTrigger ? lastProductElementRef : null}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <ProductCard prod={prod} />
                  </motion.div>
                );
              })}
            </Suspense>
          </div>
          {loading && (
            <div className="text-center mt-8">
              <Spinner size="xl" />
            </div>
          )}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-lg mb-8">Stay updated with our latest products and offers</p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button className="bg-white text-blue-500 px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
