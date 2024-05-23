import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles.css"

import axios from "axios";
const Register = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSignin = () => {
    // Redirect to the sign-up page
    navigate("/signin");
  };
  const [privacyChecked, setPrivacyChecked] = useState(false);


  const handleSubmit = async (e) => {
    if (!privacyChecked) {
      // If privacy policy checkbox is not checked, return early
      alert("Please agree to the Privacy Policy");
      return;
    }
    e.preventDefault();
    setLoading(true); // Set loading state to true while processing the form

    const Name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      // Assuming you have some validation logic here

      // Create user data object
      const userData = {
        Name,
        email,
        password,
        avatar: "https://bookworm-light-nextjs.vercel.app/_next/image?url=%2Fimages%2Fauthors%2Fmark-dinn.jpg&w=384&q=75", // Default avatar URL
      };

      // Make HTTP POST request to register user
      await axios.post("http://localhost:8080/api/register", userData);

      // If registration is successful
      console.log("User created");
      navigate("/signin"); // Navigate to the sign-in page after successful registration
    } catch (error) {
      console.error("Error:", error);
      setErr(true); // Set error state to true if any error occurs
    } finally {
      setLoading(false); // Set loading state back to false regardless of success or failure
    }
  };
  const handleCheckboxChange = (e) => {
    setPrivacyChecked(e.target.checked);
  };
  return (
    <div className="relative w-full h-full bg-theme-dark py-40 min-h-screen">
      <div
        className="  bg-contain bg-theme-dark bg-image"
        style={{
          backgroundImage:
            "url('https://demos.creative-tim.com/notus-react/static/media/register_bg_2.4f2cb0ac.png')",
        }}
      ></div>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
			
            <div className="relative flex flex-col min-w-0 break-words pt-10  bg-bluegray-200 w-full shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="flex-auto px-4 lg:px-10 py-5 pt-0">
			  
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <h3>Sign up with credentials</h3>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="Name"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Name"
                      required
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Email"
                      name="Email"
                      required
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="Password"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Password"
                      required
                    />
                  </div>

                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                        onChange={handleCheckboxChange}
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        I agree with the{" "}
                        <a
                          href="#pablo"
                          className="text-lightBlue-500"
                          onClick={(e) => e.preventDefault()}
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>

                  <div className="text-center mt-6">
                    <button disabled={loading} 
                      className="bg-white text-black active:bg-black-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
			  
			  <hr className=" border-b-1 border-blueGray-300" />
			  <div className="text-center mb-5">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Or
                  </h6>
                </div>
                <div className="btn-wrapper text-center mb-5">
                  <button
                    className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                    type="button"
                    onClick={handleSignin}
                  >
                    Sign in using Credentials
                  </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


{/* 

import React from "react";
import "../styles.css"

export default function LivePortal() {
  return (
    <div className="relative w-full h-full bg-theme-dark py-40 min-h-screen">
      <div
        className="  bg-contain bg-theme-dark bg-image"
        style={{
          backgroundImage:
            "url('https://demos.creative-tim.com/notus-react/static/media/register_bg_2.4f2cb0ac.png')",
        }}
      ></div>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
			
            <div className="relative flex flex-col min-w-0 break-words pt-10  bg-white w-full shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="flex-auto px-4 lg:px-10 py-5 pt-0">
			  
                <div className="text-blueGray-400 text-center mb-3 font-bold">
                  <h3>Sign up with credentials</h3>
                </div>
                <form>
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Name
                    </label>
                    <input
                      type="email"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Name"
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Email"
                    />
                  </div>

                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      placeholder="Password"
                    />
                  </div>

                  <div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        id="customCheckLogin"
                        type="checkbox"
                        className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                      />
                      <span className="ml-2 text-sm font-semibold text-blueGray-600">
                        I agree with the{" "}
                        <a
                          href="#pablo"
                          className="text-lightBlue-500"
                          onClick={(e) => e.preventDefault()}
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>

                  <div className="text-center mt-6">
                    <button
                      className="bg-white text-black active:bg-black-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="button"
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
			  
			  <hr className=" border-b-1 border-blueGray-300" />
			  <div className="text-center mb-5">
                  <h6 className="text-blueGray-500 text-sm font-bold">
                    Or
                  </h6>
                </div>
                <div className="btn-wrapper text-center mb-5">
                  <button
                    className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                    type="button"
                  >
                    <img
                      alt="..."
                      className="w-5 mr-1"
                      src="https://demos.creative-tim.com/notus-react/static/media/github.6c955556.svg"
                    />
                    Sign in using Credentials
                  </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


*/}
