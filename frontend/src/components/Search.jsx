import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate,  useParams } from "react-router-dom"; 
import { useSearchParams } from 'react-router-dom';

import "../styles/abc.css";
import "../styles/abcd.css";
import "../config/theme.json";
import PostLoader from "./PostLoader.jsx";
import Error from "./Error.jsx";

import axios from 'axios';

import { storage } from "../EditorComponents/firebase.js";
import { ref, uploadBytesResumable, getDownloadURL,uploadString } from "firebase/storage";

function formatDate(timestamp) {
  const date = new Date(timestamp);

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
export default function Search() {
    const navigate = useNavigate();
    const  [searchparams]  = useSearchParams();
    const input = searchparams.get('key');
    const [error, setError] = useState(null); // State to hold the error message
    const [data,setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const parseHtmlTags = (htmlString) => {
            if (!htmlString) return []; // Check if htmlString is null or undefined
            const regex = /<(p|h[1-6]|)(?:[^>]*)>.*?<\/\1>|<pre[^>]*>[\s\S]*?<\/pre>|<img[^>]*>/gi;
            return htmlString.match(regex) || [];
        };
    
        const postcontent = async (title, date) => {
            try {
                const fileRef = ref(storage, `textfile/${title}${date}.txt`);
                const url = await getDownloadURL(fileRef);
                const response = await fetch(url);
                return await response.text(); // Return the fetched text content
            } catch (error) {
                console.error('Error fetching file content:', error);
                return ""; // Return empty string if error occurs
            }
        };
    
        const transformPostObject = async (post) => {
            try {
                const content = await postcontent(post.title, formatDate(post.date)); // Fetch content for each post
    
                const htmlTags = parseHtmlTags(content); // Parse HTML tags from content
                const firstFiveTags = htmlTags.slice(1, 5); // Extract the first five tags
                const joinedTags = firstFiveTags.join(" ");
                var cleanedString = joinedTags.replace(/<[^>]*>/g, "");
    
                var first50Characters = cleanedString.substring(0, 370);
                if (first50Characters === "") {
                    first50Characters = "No Description Found"
                } else {
                    first50Characters = first50Characters + "...";
                }
                const transformedPost = {
                    id: post.id,
                    title: post.title,
                    image: post.image,
                    author: post.author.Name,
                    authorimage: post.author.avatar,
                    authorId: post.authorId,
                    date: new Date(post.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }),
                    category: post.Category,
                    content: first50Characters
                };
                return transformedPost;
            } catch (error) {
                return null; // Return null if an error occurs
            }
        };
    
        const fetchallPostDetails = async () => {
            try {
    
                setLoading(true); // Set loading state to true before fetching data
    
                const response = await axios.get(`https://intellilearn-f0dw.onrender.com/api/search?key=${input}`);
                const postData = response.data;
    
                const transformedArrayOfPostObjects = await Promise.all(postData.map(transformPostObject));
    
                const filteredPosts = transformedArrayOfPostObjects.filter(post => post !== null); // Filter out null values
                console.log(filteredPosts);
    
                setData(filteredPosts);
                setError(null); // Clear any previous errors
            } catch (error) {
                console.error("Error fetching post details:", error.message);
                setError("No Search Found");
            } finally {
                setLoading(false); // Set loading state to false when data fetching is complete
            }
        };
    
        fetchallPostDetails();
    
    }, [input]); // Add input to the dependency array
    

  

  
  return (
    <>
      <div className="section">
        <div className="container">
        <h1 className="h2 my-8 text-center">
            Search results for<span className="text-teal-500">{` ${input}`}</span>
        </h1>
          {loading ? (
            <PostLoader />
          ) : error ? (
            <div className="error-message">
              <Error errortext={error} />
            </div>
          ) : data ? (
            <div className="flex flex-row flex-wrap space-y-16 mb-16">
              {data.map((data, i) => (
                <div
                  key={i}
                  className={`p-1 py-8 sm:py-4 ${
                    i === 0 ? "col-12" : "col-12 sm:col-6 sm:w-1/2"
                  }`}
                >
                  <img
                    alt={data.title}
                    src={data.image}
                    width={i === 0 ? "925" : "445"}
                    height={i === 0 ? "475" : "230"}
                    decoding="async"
                    data-nimg="1"
                    className="rounded-lg"
                    loading="lazy"
                  />
                  <ul className="mt-4 mb-4 flex flex-wrap items-center space-x-3 text-text spaced">
                    <li className="hover:text-teal-500">
                      <a className="flex items-center" href={`/authors/${data.authorId}`}>
                        <img
                          alt={data.author}
                          src={data.authorimage}
                          width="50"
                          height="50"
                          decoding="async"
                          data-nimg="1"
                          className="mr-2 h-6 w-6 rounded-full"
                          loading="lazy"
                          style={{ color: "transparent" }}
                        />
                        <span>{data.author}</span>
                      </a>
                    </li>
                    <li className="mr-5 flex items-center flex-wrap font-medium ">
                      <svg stroke="currentColor" fill="black" strokeWidth="0" viewBox="0 0 24 24" className="mr-1 h-5 w-5 text-gray-600" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 4h-3V2h-2v2h-4V2H8v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 20V7h14V6l.002 14H5z"></path>
                        <path d="m15.628 12.183-1.8-1.799 1.37-1.371 1.8 1.799zm-7.623 4.018V18h1.799l4.976-4.97-1.799-1.799z"></path>
                      </svg>
                      {data.date}
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
                            {data.category[0]}
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <h3 className="mb-2 hover:text-teal-500">
                    <a
                      className="block hover:text-primary"
                      href={`/post/${data.id}`}
                    >
                      {data.title}
                    </a>
                  </h3>
                  <p className="text-text text-bluegray-100 break-words">{data.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="error-message">No search results found.</div>
          )}
        </div>
      </div>
    </>
  );
}

