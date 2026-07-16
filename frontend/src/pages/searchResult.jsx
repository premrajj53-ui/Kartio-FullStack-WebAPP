import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/productCard';
import '../styles/searchResult.css';

const SearchResults = () => {
    const [searchedProducts, setSearchedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const searchUrl = location.search;

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await fetch(`/api/products${searchUrl}`);
                const data = await response.json();
                setSearchedProducts(data);
            } catch (error) {
                console.error('Error fetching search results', error);
                setSearchedProducts([]);
            }
            finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchUrl]);

    const keyword = new URLSearchParams(location.search).get('keyword')?.trim() || '';
      if (loading) {
        return (
            <div className="page-shell">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Search Results</h1>
                        <p className="page-subtitle">Discover a curated collection of quality items.</p>
                    </div>
                </div>
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }


    return (
        <div className="page-shell">
            <div className="page-header">
                <div>
                    <h2 className="page-title">Search Results</h2>
                    <p className="page-subtitle">
                        {keyword ? `Showing products matching “${keyword}”` : 'Browse products from our collection.'}
                    </p>
                </div>
            </div>

            {searchedProducts.length === 0 ? (
                <div className="empty-state">
                    <p>No products found for this search.</p>
                </div>
            ) : (
                <div className="product-grid">
                    {searchedProducts.map(product => (
                        <div key={product._id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;