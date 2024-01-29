import React from "react";
import {FaSearch} from "/react-icons/fa";
import "./SearchBar.css"

export const SearchBar = () => {
  const [input, setInput] = useState('');

  // const fetchData = (value) => {
  //   fetch
  // }
  return (
    <div className="input-wrapper">
      <FaSearch id="search-icon" />

      <input 
      placeholder="Students to search..."
      value={input}
      onChange={(e) => setInput(e.target.value)}/>
    </div>
  )
}    