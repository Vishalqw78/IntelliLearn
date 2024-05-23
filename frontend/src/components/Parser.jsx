import React from "react";
import parse from "html-react-parser";
import "../EditorComponents/styles.css";


const Parser = ({ htmlcontent }) => {
  console.log(htmlcontent)
  function parseHtmlTags(htmlString) {
    if (!htmlString) return []; // Check if htmlString is null or undefined
    const regex = /<(p|img|h[1-6]|iframe)(?:[^>]*)>.*?<\/\1>|<pre[^>]*>[\s\S]*?<\/pre>|<img[^>]*>/gi;
    return htmlString.match(regex) || [];
}
const arraytag = parseHtmlTags(htmlcontent);
const slicedHtmlTagsArray = arraytag.slice(1);



  //const htmlTagsArray = parseHtmlTags(htmlcontent);
  //const slicedHtmlTagsArray = htmlTagsArray.slice(1);
  console.log(slicedHtmlTagsArray);

  return (
    <div className="mt-5">
      {slicedHtmlTagsArray.map((tag, index) => (
       
       parse(tag)// Render parsed HTML content directly here
     ))}
    </div>
  );
};

export default Parser;
