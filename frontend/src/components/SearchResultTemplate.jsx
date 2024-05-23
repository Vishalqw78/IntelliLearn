import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PostLoader from './PostLoader';
const SearchResultTemplate = ({ title, title_link, type, displayed_link, snippet }) => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const getSummarization = async (link) => {
    setLoading(true);

    const options = {
      method: 'GET',
      url: 'https://article-extractor-and-summarizer.p.rapidapi.com/summarize',
      params: {
        url: `${link}`,
        length: '3'
      },
      headers: {
        'X-RapidAPI-Key': '217bc5f557mshfd6bcd550d9a399p12e35ajsn57c4ba7379f0',
        'X-RapidAPI-Host': 'article-extractor-and-summarizer.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      console.log(response);
      setSummary(response.data.summary);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700 my-2">
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{type} {title}</h5>
      <p className="font-normal text-gray-700 dark:text-gray-400 pb-1">{displayed_link}</p>
      <p className="font-normal text-gray-700 dark:text-gray-400">{snippet}</p>
      <button
        onClick={() => getSummarization(title_link)}
        className='w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700'>
        Get Summarization
      </button>
      <Link to={title_link} target="_blank">
        <button className='w-full sm:w-auto bg-gray-800 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 m-2'>
          Get Original Paper
        </button>
      </Link>
      {loading ? (
        <PostLoader/>
      ) : (
        summary && <div>
          <h4 className="mb-2 text-lg text-center font-bold tracking-tight text-gray-900 dark:text-white">The Summary :</h4>
          <p className="font-normal text-gray-700 dark:text-gray-400 pb-1">{summary}</p>
          </div>
      )}
    </div>
  );
};

export default SearchResultTemplate;
