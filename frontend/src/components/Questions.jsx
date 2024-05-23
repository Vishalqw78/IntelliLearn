import React, { useState, useEffect, useContext } from "react";
import { useParams ,Link,useNavigate} from "react-router-dom";
import Parser from "./Parser";
import axios from "axios";
import "../styles/abc.css"
import "../EditorComponents/styles.css";
import PostLoader from "./PostLoader.jsx";
import { storage } from "../EditorComponents/firebase.js";
import { AuthContext } from "../context/AuthContext.jsx";
import SimilarPost from "./SimilarPost.jsx";
import Comments from "./Comments.jsx";
import { ref, uploadBytesResumable, getDownloadURL,uploadString } from "firebase/storage";
import Answers from "./Answer.jsx";


export default function Post() { 

  const { id } = useParams();
  const {currentUser} =useContext(AuthContext);
  const navigate = useNavigate();
  const userid = currentUser?.id;
  console.log(`userid ${userid}`);
  const [postDetails, setPostDetails] = useState(null);
  const [textContent, setTextContent] = useState(null); // State to store the text content

  function formatDate(timestamp) {
    const date = new Date(timestamp);
  
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
  
    return `${day} ${month} ${year}`;
  }

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {

        const response = await axios.get(`http://localhost:8080/api/QuestionDetails/${id}`);

        setPostDetails(response.data);

        

        
      } catch (error) {
        console.error("Error fetching post details:", error.message);
      }
    };
    

    fetchPostDetails();

  }, [id]);
  useEffect(()=> async()=>{
    try{
      await addview(id);
    }
    catch(e){
      console.log(e);
    }
  },[id])

  const addview =async(id)=>{
    try {
      const response = await axios.put(`http://localhost:8080/api/addviewQ/${id}`);
      
    } catch (error) {
      console.error("Error adding view to post:", error.message);
    }
  }

  const postcontent = ()=>{
    const fileRef = ref(storage,`questionfile/${postDetails.title}${formatDate(postDetails.date)}.txt`);

        getDownloadURL(fileRef)
          .then((url) => {
            fetch(url)
              .then(response => response.text())
              .then(text => {
                setTextContent(text); // Update the state with the fetched content
              })
              .catch(error => {
                console.error('Error fetching file content:', error);
              });
          })
          .catch((error) => {
            console.error('Error getting download URL:', error);
          });
  }
  const deletePost = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming you have a token stored in localStorage
  
      if (!token) {
        console.error('Token not found.');
        return;
      }
  
      const response = await axios.delete(`http://localhost:8080/api/deleteQuestion/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Handle the response as needed
      console.log('Post deleted successfully:', response.data);
      navigate('/doubtstore');
    } catch (error) {
      // Handle errors
      console.error('Error deleting post:', error.response);
    }
  };
const handleedit = ()=>{
  navigate(`/edit/${id}`)
}

  return (
    
    <div className="container">
      {postDetails ? (
        <>
            <section className="section">
      <div className="">
        <article>
          <h1 className="">{postDetails.title}</h1>
          <ul className="mt-4 mb-8 flex flex-wrap items-center justify-start space-x-3 text-text">
            <li>
              <Link
                to={`/authors/${postDetails.author.id}`}
                className="flex items-center hover:text-primary"
              >
                {postDetails.author.id && (
                  <img
                    src={postDetails.author.avatar}
                    alt={postDetails.author.Name}
                    height={50}
                    width={50}
                    className="mr-2 h-6 w-6 rounded-full"
                  />
                )}
                <span>{postDetails.author.Name}</span>
              </Link>
            </li>
            
            <li className="flex items-center flex-wrap">
            <svg stroke="currentColor" fill="black" strokeWidth="0" viewBox="0 0 24 24" className="mr-1 h-5 w-5 text-gray-600" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M19 4h-3V2h-2v2h-4V2H8v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM5 20V7h14V6l.002 14H5z"></path><path d="m15.628 12.183-1.8-1.799 1.37-1.371 1.8 1.799zm-7.623 4.018V18h1.799l4.976-4.97-1.799-1.799z"></path></svg>

            {formatDate(postDetails.date)}
            </li>
            
            <li  className="hover:text-teal-600 mr-1 flex items-center flex-wrap font-medium">
            <svg stroke="currentColor" fill="black" strokeWidth="0" viewBox="0 0 24 24" className="mr-1 h-[18px] w-[18px] text-gray-600" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zM9 9H5V5h4v4zm11 4h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zm-1 6h-4v-4h4v4zM17 3c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zM7 13c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"></path></svg>

              <Link
                to={`/categories/${postDetails.Category[0]}`}
                className="mr-3 hover:text-primary"
              >

                 {postDetails.Category[0]}
              </Link>
            </li>
            <li className="flex items-center flex-wrap mr-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className=""><path d="M12.015 7c4.751 0 8.063 3.012 9.504 4.636-1.401 1.837-4.713 5.364-9.504 5.364-4.42 0-7.93-3.536-9.478-5.407 1.493-1.647 4.817-4.593 9.478-4.593zm0-2c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 7l-3.36-2.171c-.405.625-.64 1.371-.64 2.171 0 2.209 1.791 4 4 4s4-1.791 4-4-1.791-4-4-4c-.742 0-1.438.202-2.033.554l2.033 3.446z"/></svg>
            {" "+postDetails.views}
            </li>
          </ul>
          {postDetails.authorId == currentUser?.id && <div className="mb-4 flex justify-end">
            <button className="text-blueGray-400 border-2 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mr-2 text-center font-semibold" onClick={deletePost}>
              Delete
            </button>
            <button className="text-blueGray-400 border-2 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mr-2 text-center font-semibold" onClick={handleedit}>
              Edit
            </button>
          </div>}
          {postcontent()}
          <Parser htmlcontent={textContent} />
          <div className="flex flex-wrap items-center justify-between mt-6">
            <ul className="mr-4 mb-4 space-x-3">
              {postDetails.Category.map((tag, i) => (
                <li className="inline-block" key={`tag-${i}`}>
                  <Link
                    to={`/categories/${tag}`}
                    className="block rounded-lg bg-blueGray-100 px-2 py-1 font-semibold text-dark hover:text-primary"
                  >
                    #{(tag)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
      <Answers questionId={id} authorId={userid} />
     
      
        

    </section>
    <div className="section">
         
        </div>
        </>
      ) : (
        <PostLoader/>
      )}
    </div>
  );
}
