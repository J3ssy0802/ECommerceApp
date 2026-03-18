import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

async function fetchCategories(): Promise<string[]> {
  const { data } = await axios.get<string[]>('https://fakestoreapi.com/products/categories');
  return data;
}

async function fetchProducts(category: string): Promise<Product[]> {
  if (!category) {
    const { data } = await axios.get<Product[]>('https://fakestoreapi.com/products');
    return data;
  }
  const { data } = await axios.get<Product[]>(`https://fakestoreapi.com/products/category/${category}`);
  return data;
}

export default function Home() {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: products, isLoading: productsLoading, isError: productsError } = useQuery<Product[]>({
    queryKey: ['products', selectedCategory],
    queryFn: () => fetchProducts(selectedCategory),
  });

  if (categoriesLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger" role="alert">
          Failed to load categories. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4">Products</h1>

      {/* Category Dropdown */}
      <div className="mb-4">
        <label htmlFor="categorySelect" className="form-label fw-bold">
          Filter by Category:
        </label>
        <select
          id="categorySelect"
          className="form-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories?.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Products Loading State */}
      {productsLoading && (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '40vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading products...</span>
          </div>
        </div>
      )}

      {/* Products Error State */}
      {productsError && (
        <div className="alert alert-danger" role="alert">
          Failed to load products. Please try again later.
        </div>
      )}

      {/* Products Grid */}
      {products && products.length > 0 && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
          {products.map((product) => (
            <div key={product.id} className="col">
              <div className="card h-100 shadow-sm">
                <div
                  className="d-flex align-items-center justify-content-center p-3"
                  style={{ height: '220px', background: '#f8f9fa' }}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <span className="badge bg-secondary text-uppercase mb-2" style={{ width: 'fit-content' }}>
                    {product.category}
                  </span>
                  <h5 className="card-title" style={{ fontSize: '0.95rem' }}>
                    {product.title}
                  </h5>
                  <p className="card-text text-muted" style={{ fontSize: '0.85rem', flexGrow: 1 }}>
                    {product.description}
                  </p>
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <span className="fs-5 fw-bold text-primary">${product.price.toFixed(2)}</span>
                    <span className="text-warning fw-semibold">
                      ★ {product.rating.rate}
                      <span className="text-muted fw-normal ms-1" style={{ fontSize: '0.8rem' }}>
                        ({product.rating.count})
                      </span>
                    </span>
                  </div>
                  <button
                    className="btn btn-primary mt-3 w-100"
                    onClick={() =>
                      dispatch(
                        addToCart({
                          id: product.id,
                          title: product.title,
                          price: product.price,
                          image: product.image,
                        })
                      )
                    }
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Products State */}
      {products && products.length === 0 && !productsLoading && (
        <div className="alert alert-info" role="alert">
          No products found in this category.
        </div>
      )}
    </div>
  );
}
