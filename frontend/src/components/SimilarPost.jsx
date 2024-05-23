import { useEffect, useState } from "react";
import axios from 'axios';
import Error from "./Error";
import "../styles/abc.css"
function formatDate(timestamp) {
    const date = new Date(timestamp);
  
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
  
    return `${day} ${month} ${year}`;
  }

const SimilarPosts = ({ currentTableData }) => {
    return (
  <div className="flex flex-wrap row space-y-16 mb-16">
    {currentTableData.map((data, i) => (
      <div
        key={i}
        className={`p-1 pt-4  col-12 sm:col-4 sm:w-1/3`}
      >
        <img
          alt={data.title}
          src={data.image}
          width="445"
          height="230"
          className="rounded-lg"
          loading="lazy"
          style={{ color: "transparent" }}
        />
        <ul className="mt-4 mb-4 flex flex-wrap items-center space-x-3 text- spaced">
         
          <li className="mr-5 flex items-center flex-wrap font-medium ">
            
            {formatDate(data.date)}
          </li>
          <li className="hover:text-teal-600 mr-5 flex items-center flex-wrap font-medium">
            <svg stroke="currentColor" fill="black" strokeWidth="0" viewBox="0 0 24 24" className="mr-1 h-[18px] w-[18px] text-gray-600" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM9 9H5V5h4v4zm11 4h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4v4zM17 3c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zM7 13c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"></path>
            </svg>
            <ul>
              <li className="inline-block">
                <a
                  className="mr-3 hover:text-teal-500"
                  href="/categories/art"
                >
                  {data.Category[0]}
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <h4 className="mb-2 hover:text-teal-500 break-words">
          <a
            className="block hover:text-primary"
            href={`/post/${data.id}`}
          >
            {data.title}
          </a>
        </h4></div>
    ))}
  </div>

    );
  };
  
  export default SimilarPosts;