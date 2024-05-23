import { useRef, useState } from 'react';
import axios from 'axios';
import "../styles/abc.css"
import SearchResultTemplate from "./SearchResultTemplate";

const AISummarizer = () => {
  const searchInput = useRef(null);
  const content = useRef(null);
  const [scholarData, setScholarData] = useState(null);
  const [summarizeData, setSummarizeData] = useState("");
  const [clicked, setClicked] = useState(false);
  const [isSummarize, setIsSummarize] = useState(false);
  const [loading, setLoading] = useState(false);

  const getData = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.serpdog.io/scholar`, {
        params: { api_key:"66488cf0463fa6717d78a17d", q: query }
      });
      console.log(response.data);
      setScholarData(response.data);
    } catch (error) {
      console.error("Error fetching scholar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setClicked(true);
    if (searchInput.current.value) {
      getData(searchInput.current.value);
    }
  };

  const result = async (searchText) => {
    try {
      const prompt = "act as a text summarization system and summarize the given text under 400 words with following the simple language which you can :-  " + searchText;
      const response = await model.generateContent(prompt);
      setSummarizeData(response.response.text());
    } catch (error) {
      console.error("Error summarizing text:", error);
    }
  };

  const handleSummarizer = (event) => {
    event.preventDefault();
    if (content.current.value) {
      result(content.current.value);
    }
  };

  return (
    <div className="container pt-20 w-[100%] min-h-[100vh] mb-20">
      <div>
      <div className="p-6">
    <div className="w-full">
    <form onSubmit={handleSearch} className="flex items-center mx-auto">   
      <div className="relative w-full">
    
        <input
          ref={searchInput}
          type="text"
          id="simple-search"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search for Research Paper titles or authors"
          required
        />
      </div>
      <button
        type="submit"
        className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
        </svg>
        <span className="sr-only">Search</span>
      </button>
    </form>
    </div>
</div>
      
        
        <div className='w-[100%] flex flex-col gap-4 items-center pt-10'>
          
          {isSummarize && summarizeData &&
            <div className='border border-black rounded-lg px-4 py-2 text-lg leading-7 text-black w-[60%] bg-white max-h-[400px] overflow-y-scroll no-scrollbar'>
              <p>{summarizeData}</p>
            </div>
          }
          {!isSummarize && !scholarData && !summarizeData &&
            <div className="w-[50%] aspect-auto">
              <img src="https://firebasestorage.googleapis.com/v0/b/quickconnect78.appspot.com/o/Research%20paper-pana.png?alt=media&token=b9117f2b-a058-4b00-b4a9-f22b5a732913" alt="research_Image" />
            </div>
          }
        </div>
      </div>

      {loading && 
        <div className="z-2 h-[100vh] w-[100%] flex items-center justify-center absolute top-0 left-0 opacity-80">
          <div>Loading...</div>
        </div>
      }

      {scholarData &&
  <div className="grid grid-cols-1 md:grid-cols-10 w-full pt-8">
    <div className="col-span-10 md:col-span-7 px-9 py-3">
      <p className="text-red-600 text-5xl mb-6">Results</p>
      <div className="h-[80vh] overflow-y-auto">
        {scholarData.scholar_results?.map((result) => (
          <SearchResultTemplate
            key={result.id}
            title={result.title}
            type={result.type}
            title_link={result.title_link}
            displayed_link={result.displayed_link}
            snippet={result.snippet}
          />
        ))}
      </div>
    </div>
    
    <div className="hidden md:block md:col-span-3 border-l-2 py-3 px-9">
      <p className="text-red-600 text-5xl mb-6">Related Searches</p>
      <div className="h-[80vh] overflow-y-auto">
        <ul className="list-disc flex flex-col gap-3">
          {scholarData.related_searches?.map((result) => (
            <li
              key={result.title}
              onClick={(event) => {
                searchInput.current.value = result.title;
                handleSearch(event);
              }}
              className="font-bold text-lg cursor-pointer"
            >
              {result.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
}

    </div>
  );
};

export default AISummarizer;
