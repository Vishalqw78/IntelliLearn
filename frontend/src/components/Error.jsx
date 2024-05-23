import React, { useState, useEffect } from "react";
import "../styles/tailwind-pre-build.css";

const Error = ({ errortext }) => {
  
    return (
          <div className="flex h-8 items-center justify-center">
            <div className="text-center">
              <h1 className="mb-4">Error 404</h1>
              <h2 className="mb-2 text-[#374151]">{errortext}</h2>

            </div>
          </div>
    );
  };

  export default Error;
