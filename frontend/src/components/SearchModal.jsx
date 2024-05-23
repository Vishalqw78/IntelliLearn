import React, { useState,useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { IoCloseCircleOutline } from "react-icons/io5";
import "../styles/ab.css";
import "../styles/abc.css";

const SearchModal = ({ searchModal, setSearchModal }) => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null); // Ref to the input element


  const handleSearch = async () => {
    if (input.trim() === '') return;

    try {
      // Make a GET request to fetch posts based on the search query
      
      // Close the modal and navigate to the home page
      setSearchModal(false);
      navigate(`/search?key=${input}`);
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  useEffect(() => {
    // Reset input value when searchModal changes to false
    if (!searchModal) {
      setInput("");
    }
    if(searchModal){
      inputRef.current.focus();
    }
  }, [searchModal]);

  return (
    <div className={`search-modal ${searchModal ? "open" : ""}`}>
      <button onClick={() => setSearchModal(false)} className="search-close">
        <IoCloseCircleOutline />
      </button>
      <input
        type="text"
        className="form-input"
        id="searchModal"
        placeholder="Type and hit enter..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        ref={inputRef}
      />
    </div>
  );
};

export default SearchModal;
