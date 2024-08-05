// function NoteDetail() {

//   const [note ,setNote] = useState({});
//   const [writing , setWriting] = useState("writing");
//   const { id } = useParams()
  
//   // const fetchData = async () => {
//   //   try {
//   //     // Make the PATCH and GET requests
//   //     const writing_throw = axios.patch(`http://localhost:5000/writing-status/${id}`);
//   //     const response = axios.get(`http://localhost:5000/get-specific-note/${id}`);
    
//   //     // Wait for both requests to complete
//   //     axios.all([writing_throw, response]).then(
//   //       axios.spread((writingThrowResponse, getNoteResponse) => {
//   //         const writing = writingThrowResponse.data; // Handle PATCH response data
//   //         const spec = getNoteResponse.data; // Handle GET response data
          
//   //         // Log the specific note response
//   //         console.log(spec);
//   //         setNote(spec);
//   //       })
//   //     ).catch(error => {
//   //       // Handle any error that occurred during the requests
//   //       console.error('Error occurred during requests:', error);
//   //     });
//   //   } catch (error) {
//   //     // Handle any unexpected errors that occurred in the try block
//   //     console.error('Unexpected error:', error);
//   //   }
//   // }

//   const fetchData = async () => {
//     try {
//       const writingThrowResponse = await axios.patch(`http://localhost:5000/writing-status/${id}`);
//       const getNoteResponse = await axios.get(`http://localhost:5000/get-specific-note/${id}`);

//       const writing = writingThrowResponse.data;
//       const spec = getNoteResponse.data;

//       console.log(spec);
//       setNote(spec);
//     } catch (error) {
//       console.error('Error occurred during requests:', error);
//     }
//   };

//   const handleSwitchMode = async () => {
//     try {
//       const newWriting = writing === "writing" ? "reading" : "writing";
//       const response = await axios.put(`http://localhost:5000/writing-switch/${id}`);
  
//       // Update state and potentially handle success/failure messages
//       setWriting(newWriting, () => {
//         if (response.status === 200) { // Assuming successful switch on status code 200
//           console.log(`Switched to ${newWriting} mode`);
//         } else {
//           console.error('Switch failed:', response.statusText);
//           // Optionally display an error message to the user
//         }
//       });
//     } catch (error) {
//       console.error('Switch Error: ', error);
//       // Optionally display an error message to the user
//     }
//   };

//   // useEffect(() => {
//   //   fetchData();
//   //   const interval = setInterval(() => {
//   //     fetchData();
//   //   }, 1);
//   //   return () => clearInterval(interval);
//   // }, [id]);
//   useEffect(() => {
//     fetchData();
//   }, []);


//   return (
//     <div className={"p-5 bg-blue-200 w-screen h-screen"}>
//       <div className="flex flex-row">  
//         <div>Do something to write</div>
//         <button className='bg-white ml-4 hover:bg-red-200' onClick={handleSwitchMode}>Switch mode</button>
//       </div>
//       <div>Status : {writing}</div>
//       <div>Title : {note.note_title}</div>
//       <div>ID : {note.note_id}</div>
//       <div>Content : {note.note_content}</div>
//     </div>
//   )
// }

// export default NoteDetail;

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import React from 'react'

function NoteDetail() {
  const { id } = useParams();

  const [status ,setStatus] = useState("OFF");
  const [response , setResponse] = useState({});
  const [word , setWord] = useState('');
  const [letter , setLetter] = useState('');

  const handleSwitch = async() => {
    setStatus((prevState) => (prevState === "OFF" ? "ON" : "OFF" ));
    try {
      if (status == "OFF") {
        const temp = await axios.put(`http://localhost:5000/writing-switch/${id}`)  
        console.log(temp);
      } else {
        const temp = await axios.put(`http://localhost:5000/reading-switch/${id}`)
        console.log(temp);
      }
    } catch (error) {
      console.log("Switch error: " , error);
    }
  }

  const fetch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/get-specific-note/${id}`)
      console.log(res.data);
      await setResponse(res.data);
      await setWord(res.data.note_content);
      if (response.pos_reading >= 0 && response.pos_reading < response.note_content.length) {
        const temp_l = response.note_content[response.pos_reading];
        setLetter(temp_l);
      } else {
        console.error('Invalid position for letter:', response.pos_reading);
      }
    } catch (error) {
      console.error("Fetch Error" , error);   
    }
  }

  useEffect(() => {
    fetch(); 
  } , [])

  useEffect(() => {
    fetch(); 
  } , [response])

  useEffect(() => {
    fetch(); 
  } , [status])

  return (
    <div className='flex flex-col bg-blue-200 p-12 h-screen'>
      <button onClick={handleSwitch} className='bg-white p-2 focus:bg-blue-300 rounded-lg '>Switch</button>
      <button className="bg-white p-2 focus:bg-blue-300 mt-4 rounded-lg" onClick={fetch}>Fetch</button>
      <Link to='/' className="bg-white p-2 focus:bg-blue-300 text-center mt-4 rounded-lg">
        Home
      </Link>

      <div className='mt-10 text-xl'>
        <div className='text-4xl font-bold'>Title : {response.note_title } ({response.note_id})</div>
        <div className='text-2xl mt-3 text-slate-500'>Status : {status}</div>
        
        <div className='mt-4'>Content : {response.note_content}</div>
        <div>Reading letter: {letter}</div>
      </div>
      
      
    </div>
  )
}

export default NoteDetail;
