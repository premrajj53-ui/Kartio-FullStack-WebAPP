import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/search.css";
const Search = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            
            navigate(`/search?keyword=${keyword}`);
        } else {
            
            navigate('/shop');
        }
    };

    return (
    
        <div className="search-container">
        <form onSubmit={handleSubmit}>
           <span className="search-input-container"> 
            <input className="search-input"
                type="text" 
                placeholder="Search Products..." 
                onChange={(e) => setKeyword(e.target.value)}  />
            <button className="search-btn" type="submit">Search</button>
            </span>
          
        </form>
        </div>
    );
};

export default Search;