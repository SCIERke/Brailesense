import React from 'react';
import { useState } from 'react';
import axios from 'axios';

export default function Api() {
  const [text ,setText] = useState("");
  const [author , setAuthor] = useState("");

  const getQuote = () => {
    axios.get('http://localhost:5000/' ,{ crossdomain: true})
          .then(response => {
              setText(response.data.text);
              setAuthor(response.data.author);  
          })
  }
  
  return (
    <div>
      <button onClick={getQuote}>
        Generate Qu
      </button>
      <h1>{text}</h1>
      <h3>{"-" + author}</h3>
    </div>
  )
}
