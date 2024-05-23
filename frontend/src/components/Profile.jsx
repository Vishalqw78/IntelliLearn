import React, { useEffect, useState ,useContext} from "react";
import { useParams,useNavigate} from "react-router-dom";
import axios from 'axios';
import Error from "./Error";
import PostLoader from "./PostLoader";
import SimilarPost from "./SimilarPost";
import { AuthContext } from "../context/AuthContext";


const Profile = () => {
  const {currentUser} =useContext(AuthContext);
  const navigate = useNavigate();


  const Name= currentUser?.Name;
  const id = currentUser ? currentUser.id : null;
  const imagename = currentUser?.avatar;

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
    console.log("logout");
    window.location.reload();
  }
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state as true
  const [editingSocial, setEditingSocial] = useState(false);
  const [socialData, setSocialData] = useState({
    facebook: "",
    insta: "",
    twitter: ""
  });

  useEffect(() => {
    const fetchAuthorDetails = async () => {
      try {
        // Check if id is truthy (not null or undefined)
        if (id) {
          const response = await axios.get(`http://localhost:8080/api/author/${id}`);
          console.log(response.data);
          setDetails(response.data);
          setSocialData(response.data.social); // Set social data from fetched details
          setLoading(false); // Set loading to false after successful fetch
        } else {
          // If id is not yet defined, wait for it to be available
          console.log("Waiting for id...");
        }
      } catch (error) {
        console.error("Error fetching author details:", error.message);
        setError("Author does not Exist");
        setLoading(false); // Set loading to false even if there's an error
      }
    }
  
    fetchAuthorDetails();
  }, [id]); // Re-run the effect whenever id changes
  

  const handleInputChange = ({ currentTarget: input }) => {
    setSocialData({ ...socialData, [input.name]: input.value });
  };

  const handleEditSocial = () => {
    setEditingSocial(true);
  };

  const handleSaveSocial = async () => {
    try {
      // Send a PUT request to update the social profile
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found.");
        return;
      }
      await axios.put(`http://localhost:8080/api/profile/${details.id}`, socialData,{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Once saved, update the details state
      setDetails((prevDetails) => ({
        ...prevDetails,
        social: socialData,
      }));
      setEditingSocial(false);
    } catch (error) {
      console.error("Error updating social profile:", error.message);
    }
  };

  return (
    <div className="section">
      <div className="container">
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
                <button className="text-blueGray-400 border-2 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 text-center font-semibold" onClick={logout}>
              Logout
              </button>
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
              <div className="mb-4 flex justify-end">
                {editingSocial ? (
                  <button className="text-blueGray-400 border-2 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 text-center font-semibold" onClick={handleSaveSocial}>Save</button>
                ) : (
                  <button className="text-blueGray-400 border-2 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 text-center font-semibold" onClick={handleEditSocial}>Edit</button>
                )}
              </div>
              {editingSocial ? (
                <>
                <div>
                  <label htmlFor="facebook" className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Facebook URL:</label>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    className="border-0 px-3 mb-2 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={socialData.insta || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="insta" className="block uppercase text-blueGray-600 text-xs font-bold mb-2">Instagram URL:</label>
                  <input
                    type="text"
                    id="insta"
                    name="insta"
                    className="border-0 px-3 mb-2 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    value={socialData.insta ||""}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="X"className="block uppercase text-blueGray-600 text-xs font-bold mb-2">X URL:</label>
                  <input
                    type="text"
                    id="twitter"
                    className="border-0 px-3 mb-2 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    name="twitter"
                    value={socialData.twitter || ""}
                    onChange={handleInputChange}
                  />
                </div>
                </>
              ) : (
                <ul className="social-icons-simple text-center">
                  <li className="inline-block">
                    <a
                      aria-label="facebook"
                      href={`${details.social?.facebook || ""}`}
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
                  <li className="inline-block">
                    <a
                      aria-label="instagram"
                      href={`${details.social?.insta || ""}`}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M349.33 69.33a93.62 93.62 0 0193.34 93.34v186.66a93.62 93.62 0 01-93.34 93.34H162.67a93.62 93.62 0 01-93.34-93.34V162.67a93.62 93.62 0 0193.34-93.34h186.66m0-37.33H162.67C90.8 32 32 90.8 32 162.67v186.66C32 421.2 90.8 480 162.67 480h186.66C421.2 480 480 421.2 480 349.33V162.67C480 90.8 421.2 32 349.33 32z"></path><path d="M377.33 162.67a28 28 0 1128-28 27.94 27.94 0 01-28 28zM256 181.33A74.67 74.67 0 11181.33 256 74.75 74.75 0 01256 181.33m0-37.33a112 112 0 10112 112 112 112 0 00-112-112z"></path></svg>
                    </a>
                  </li>
                  <li className="inline-block">
                    <a
                      aria-label="twittwe"
                      href={`${details.social?.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M496 109.5a201.8 201.8 0 01-56.55 15.3 97.51 97.51 0 0043.33-53.6 197.74 197.74 0 01-62.56 23.5A99.14 99.14 0 00348.31 64c-54.42 0-98.46 43.4-98.46 96.9a93.21 93.21 0 002.54 22.1 280.7 280.7 0 01-203-101.3A95.69 95.69 0 0036 130.4c0 33.6 17.53 63.3 44 80.7A97.5 97.5 0 0135.22 199v1.2c0 47 34 86.1 79 95a100.76 100.76 0 01-25.94 3.4 94.38 94.38 0 01-18.51-1.8c12.51 38.5 48.92 66.5 92.05 67.3A199.59 199.59 0 0139.5 405.6a203 203 0 01-23.5-1.4A278.68 278.68 0 00166.74 448c181.36 0 280.44-147.7 280.44-275.8 0-4.2-.11-8.4-.31-12.5A198.48 198.48 0 00496 109.5z"></path></svg>
                    </a>
                  </li>
                </ul>
              )}
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

export default Profile;
