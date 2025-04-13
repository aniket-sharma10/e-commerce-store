import { Button, Drawer, Label, Spinner, Badge } from "flowbite-react";
import React, { useEffect, useState, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CgCloseR } from "react-icons/cg";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilter } from "react-icons/fa";

// Lazy load the ProductCard component
const ProductCard = lazy(() => import("../components/ProductCard"));

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const filterButtonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: { scale: 0.95 }
};

const drawerVariants = {
  hidden: { x: "100%" },
  visible: { 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

function Collections() {
  const { collectionName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState("default");

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/product/search?categories=${collectionName}&limit=0`
        );
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products);
          setFilteredProducts(data.products);
          setLoading(false);
          const allCategories = data.products.flatMap(
            (prod) => prod.categories
          );
          const uniqueCategories = [
            ...new Set(allCategories.filter((cat) => cat !== collectionName)),
          ];
          const uniqueBrands = [
            ...new Set(data.products.map((prod) => prod.brand)),
          ];
          setCategories(uniqueCategories);
          setBrands(uniqueBrands);
          const prices = data.products.map((prod) => prod.price);
          const min = Math.floor(Math.min(...prices) / 100) * 100;
          const max = Math.ceil(Math.max(...prices) / 100) * 100;
          setMinPrice(min);
          setMaxPrice(max);
          setSelectedMaxPrice(max);
        } else {
          setLoading(false);
          return toast.error(data.msg);
        }
      } catch (error) {
        setLoading(false);
        console.log(error.message);
      }
    };
    fetchProducts();
  }, [collectionName]);

  useEffect(() => {
    let filtered = [...products];

    // Apply category filters
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((prod) =>
        prod.categories.some((cat) => selectedCategories.includes(cat))
      );
    }

    // Apply brand filters
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((prod) =>
        selectedBrands.includes(prod.brand)
      );
    }

    // Apply price filter
    filtered = filtered.filter(
      (prod) => prod.price >= minPrice && prod.price <= selectedMaxPrice
    );

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategories, selectedBrands, selectedMaxPrice, sortBy]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleMaxPriceChange = (value) => {
    setSelectedMaxPrice(value);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full p-4 min-h-screen flex flex-col justify-center items-center"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Spinner size={"xl"} />
        </motion.div>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="ml-2 text-2xl mt-4"
        >
          Loading...
        </motion.p>
      </motion.div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full p-4 min-h-screen flex flex-col justify-center items-center"
      >
        <motion.p 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-4 text-2xl"
        >
          No products found!
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            gradientDuoTone="cyanToBlue" 
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen w-full max-w-7xl mx-auto my-10 mb-20 p-2 md:p-6 relative"
    >
      <motion.div 
        variants={containerVariants}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 px-2 sm:px-4"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text capitalize">
            {collectionName}
          </h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-gray-600"
          >
            {filteredProducts.length} products found
          </motion.p>
        </motion.div>
        <motion.div 
          variants={itemVariants}
          className="flex self-end md:items-center  gap-4"
        >
          <motion.select
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02 }}
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
          >
            <option value="default">Sort by</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </motion.select>
          <motion.div
            variants={filterButtonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              gradientDuoTone="cyanToBlue"
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2"
            >
              <FaFilter className="w-4 h-4 text-white" />
              Filters
              {(selectedCategories.length > 0 || selectedBrands.length > 0) && (
                <Badge color="red" className="ml-2">
                  {selectedCategories.length + selectedBrands.length}
                </Badge>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

        {/* Products section */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <Suspense fallback={
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full text-center"
          >
            Loading products...
          </motion.div>
        }>
          <AnimatePresence>
            {filteredProducts.map((prod, index) => (
              <motion.div
                key={prod._id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100,
                  damping: 10
                }}
              >
                <ProductCard prod={prod} />
              </motion.div>
            ))}
          </AnimatePresence>
        </Suspense>
      </motion.div>

      {/* Filters section */} 
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-[100]"
              onClick={handleClose}
            />
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={drawerVariants}
              className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-lg z-[101] overflow-y-auto"
            >
              <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-[102]">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl font-medium"
                >
                  Filters
                </motion.h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClose}
                  className="text-2xl"
                >
                  <CgCloseR />
                </motion.button>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="p-4"
              >
                <form className="space-y-6">
                  <div>
                    <Label htmlFor="categories" className="mb-2 block text-lg font-semibold">
                      Categories
                    </Label>
                    <div className="space-y-2">
                      {categories.map((category, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`category-${index}`}
                            name={category}
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={`category-${index}`} className="ml-2 text-sm font-medium text-gray-900 capitalize">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="brands" className="mb-2 block text-lg font-semibold">
                      Brands
                    </Label>
                    <div className="space-y-2">
                      {brands.map((brand, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`brand-${index}`}
                            name={brand}
                            checked={selectedBrands.includes(brand)}
                            onChange={() => handleBrandChange(brand)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor={`brand-${index}`} className="ml-2 text-sm font-medium text-gray-900 capitalize">
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="price-range" className="mb-2 block text-lg font-semibold">
                      Price Range
                    </Label>
                    <div className="px-2">
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        value={selectedMaxPrice}
                        onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>₹{minPrice}</span>
                        <span>₹{selectedMaxPrice}</span>
                      </div>
                    </div>
                  </div>

                  <motion.div 
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        color="gray"
                        className="flex-1"
                        onClick={() => {
                          setSelectedCategories([]);
                          setSelectedBrands([]);
                          setSelectedMaxPrice(maxPrice);
                        }}
                      >
                        Clear All
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        gradientDuoTone="cyanToBlue"
                        className="flex-1"
                        onClick={handleClose}
                      >
                        Apply Filters
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Collections;
