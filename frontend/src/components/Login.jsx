import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "https://intellilearn-f0dw.onrender.com/api/login";
      const { data: res } = await axios.post(url, data);
      localStorage.setItem("token", res.data);
      window.location = "/";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        toast.error(error.response.data.message);  // Display error message using toast
      }
    }
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <div className="relative w-full h-full bg-theme-dark py-40 min-h-screen">
      <ToastContainer /> {/* Add ToastContainer here */}
      <div
        className="bg-contain bg-theme-dark bg-image"
        style={{
          backgroundImage:
            "url('https://demos.creative-tim.com/notus-react/static/media/register_bg_2.4f2cb0ac.png')",
        }}
      ></div>
      <div className="container mx-auto px-4 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words pt-10 bg-bluegray-200 w-full shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="flex-auto px-4 lg:px-10 py-5 pt-0">
                <div className="text-blueGray-400 text-center mb-5 mt-3 font-bold">
                  <h2>Welcome Back!</h2>
                </div>
                <div className="text-blueGray-400 text-center mb-5 mt-3 font-bold">
                  <h3>Sign in with credentials</h3>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="relative w-full mb-3 mt-2">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Email
                    </label>
                    <input
                      className="border-0 mb-2 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      type="email"
                      placeholder="Email"
                      name="email"
                      onChange={handleChange}
                      value={data.email}
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
                      className="border-0 px-3 mb-2 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      type="password"
                      placeholder="Password"
                      name="password"
                      onChange={handleChange}
                      value={data.password}
                      required
                    />
                  </div>
                  <div className="text-center mt-6 mb-4">
                    <button
                      className="bg-white text-black active:bg-black-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="submit"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              </div>
              <hr className="border-b-1 border-blueGray-300" />
              <div className="text-center mb-5">
                <h6 className="text-blueGray-500 text-sm font-bold">Or</h6>
              </div>
              <div className="btn-wrapper text-center mb-5">
                <button
                  className="bg-white active:bg-blueGray-50 text-blueGray-700 font-normal px-4 py-2 rounded outline-none focus:outline-none mr-2 mb-1 uppercase shadow hover:shadow-md inline-flex items-center font-bold text-xs ease-linear transition-all duration-150"
                  type="button"
                  onClick={handleSignUp}
                >
                  Sign Up using Credentials
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;