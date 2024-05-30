import { useEffect, useState ,useContext} from "react";
import { useParams ,useNavigate} from "react-router-dom";
import axios from 'axios';
import Error from "./Error";
import PostLoader from "./PostLoader";
import SimilarPost from "./SimilarPost";
import { AuthContext } from "../context/AuthContext";

const Author = () => {
  const { id } = useParams();
  
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const currentid = currentUser?.id;
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state as true

  useEffect(() => {
    const fetchAuthorDetails = async () => {
      try {
        const response = await axios.get(`https://intellilearn-f0dw.onrender.com/api/author/${id}`);
        console.log(response.data);
        setDetails(response.data);
      } catch (error) {
        console.error("Error fetching author details:", error.message);
        setError("Author does not Exist");
      } finally {
        // After fetching, set loading to false
        setLoading(false);
      }
    }
    fetchAuthorDetails();
  }, [id]);

  useEffect(() => {
    if (id === currentid) {
      navigate('/profile');
    }
  }, [id, currentid, navigate]);

  return (
    <div className="section">
      <div className="container">
        
    {console.log(currentid,id,currentid === id)}
        {loading ? (
          <PostLoader /> // Render loader while loading
        ) : error ? (
          <div className="error-message">
            <Error errortext={error} />
          </div>
        ) : (
          details ? (
            <div className="mb-4  md:px-14">
              <div className="mb-4 flex justify-end">
              </div>
              <div className="mb-8 text-center">
                <img
                  src={`${details.avatar}`}
                  className="mx-auto rounded-lg text-center"
                  alt={details.Name}
                  width="150"
                  height="150"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h1 className="page-heading h2 mb-8 text-center">{details.Name}</h1>{" "}
              
              <ul className="social-icons-simple text-center">
                { details.social?.facebook &&            <li className="inline-block">
                  <a
                    aria-label="facebook"
                    href={`${details.social.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 512 512"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M480 257.35c0-123.7-100.3-224-224-224s-224 100.3-224 224c0 111.8 81.9 204.47 189 221.29V322.12h-56.89v-64.77H221V208c0-56.13 33.45-87.16 84.61-87.16 24.51 0 50.15 4.38 50.15 4.38v55.13H327.5c-27.81 0-36.51 17.26-36.51 35v42h62.12l-9.92 64.77H291v156.54c107.1-16.81 189-109.48 189-221.31z"
                      ></path>
                    </svg>
                  </a>
                </li>
                }
                {details.social?.insta && <li className="inline-block">
                    <a
                      aria-label="instagram"
                      href={`${details.social.insta || ""}`}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M349.33 69.33a93.62 93.62 0 0193.34 93.34v186.66a93.62 93.62 0 01-93.34 93.34H162.67a93.62 93.62 0 01-93.34-93.34V162.67a93.62 93.62 0 0193.34-93.34h186.66m0-37.33H162.67C90.8 32 32 90.8 32 162.67v186.66C32 421.2 90.8 480 162.67 480h186.66C421.2 480 480 421.2 480 349.33V162.67C480 90.8 421.2 32 349.33 32z"></path><path d="M377.33 162.67a28 28 0 1128-28 27.94 27.94 0 01-28 28zM256 181.33A74.67 74.67 0 11181.33 256 74.75 74.75 0 01256 181.33m0-37.33a112 112 0 10112 112 112 112 0 00-112-112z"></path></svg>
                    </a>
                  </li>}
                  {details.social?.twitter && <li className="inline-block">
                    <a
                      aria-label="twitter"
                      href={`${details.social.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M496 109.5a201.8 201.8 0 01-56.55 15.3 97.51 97.51 0 0043.33-53.6 197.74 197.74 0 01-62.56 23.5A99.14 99.14 0 00348.31 64c-54.42 0-98.46 43.4-98.46 96.9a93.21 93.21 0 002.54 22.1 280.7 280.7 0 01-203-101.3A95.69 95.69 0 0036 130.4c0 33.6 17.53 63.3 44 80.7A97.5 97.5 0 0135.22 199v1.2c0 47 34 86.1 79 95a100.76 100.76 0 01-25.94 3.4 94.38 94.38 0 01-18.51-1.8c12.51 38.5 48.92 66.5 92.05 67.3A199.59 199.59 0 0139.5 405.6a203 203 0 01-23.5-1.4A278.68 278.68 0 00166.74 448c181.36 0 280.44-147.7 280.44-275.8 0-4.2-.11-8.4-.31-12.5A198.48 198.48 0 00496 109.5z"></path></svg>
                    </a>
                  </li>}
              </ul>
              <div className="text-center">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                  enim ad minim veniam, quis nostrud exercitation ullamco laboris
                  nisi ut aliquip ex
                  </p>
              </div>
              <div className="section">
                <h3 className="my-8 text-center">Author's Post</h3>
                <SimilarPost currentTableData={details.userposts}/>
              </div>
            </div>
          ) : (
            <div className="error-message">Author details not found.</div>
          )
        )}
      </div>
    </div>
  );
};

export default Author;
