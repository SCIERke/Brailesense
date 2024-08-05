import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState , useEffect } from 'react';
import './App.css';
import logo from './logo.svg';
import { useNavigate } from 'react-router-dom';


function App() {
  const [notes ,setNotes] = useState([]);
  const [IDnow ,setIDnow] = useState(0);
  
  const navigate = useNavigate();
  //fetchData
  const fetchNotes = async() => {
    try {
      const response = await axios.get('http://localhost:5000/get-note');
      const reset_res = await axios.patch('http://localhost:5000/reset-writing');
      setNotes(response.data);
      setIDnow(response.data.length);
      console.log(response.data);
    } catch (error) {
      console.error("Fetch-Note Error:", error);
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete-note/${id}`);
      fetchNotes();
    } catch (error) {
      console.error("Delete-Note Error:", error);
    }
  }

  const handleReset = async () => {
    try {
      await axios.get(`http://localhost:5000/reset-pin`);
    } catch (error) {
      console.error("Reset-Note Error:", error);
    }
  }

  useEffect(() => {
    handleReset();
  } ,[])


  useEffect(() => {
    fetchNotes();
  } ,[])

  return (
    <div className='bg-blue-200 w-screen h-screen p-12' >
      <div className='flex'>
        <Link to={`/create-note/${IDnow+1}`} className=" bg-white w-screen justify-center p-2 px-96 text-center focus:bg-blue-300">
          Create Note
        </Link>
      </div>
      
      <div className='mt-4 bg-blue-400 w-60 h-2 '/>
      {/* <div className='flex flex-row inline-block'>
        {
          notes.map((note, index) => (
            <div key={index} className="p-2 bg-blue-400">
              {note.note_title} {note.note_content}  id:{note.note_id}
              <Link to={`/note/${note.note_id}`} className="bg-white ml-3 p-2 focus:bg-blue-300">
                Edit
              </Link>
              <button className="bg-white ml-3 p-2 focus:bg-blue-300" onClick={() => handleDelete(note.note_id)} >Delete</button>
            </div>
          ))
        }
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {notes.map((note, index) => (
        <div key={index} className="note rounded-lg shadow-md p-4 bg-white hover:bg-gray-300">
          <div className="font-bold text-lg mb-2">{note.note_title}</div> 
          <p className="text-gray-700">{note.note_content}</p> 
          <div className="flex justify-end items-center"> 
            <Link to={`/note/${note.note_id}`} className="rounded-lg bg-gray-300 ml-3 p-2 focus:bg-blue-300 hover:text-blue-500 px-4">
              Edit
            </Link>
            <button className="bg-gray-300 ml-3 p-2 rounded-lg px-5 focus:bg-blue-300 hover:text-red-500" onClick={() => handleDelete(note.note_id)}>
              Delete
            </button>
          </div>
        </div>
      ))}
</div>
    </div>
  );
} 

export default App;
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { useState, useEffect, useRef } from 'react';
// import './App.css';
// import logo from './logo.svg';
// import { useNavigate } from 'react-router-dom';

// function App() {
//   const [notes, setNotes] = useState([]);
//   const [currentNoteId, setCurrentNoteId] = useState(0);
//   const [isLoading, setIsLoading] = useState(false); // Track loading state
//   const [error, setError] = useState(null); // Track errors
//   const focusedNoteRef = useRef(null); // Ref to track focused note element

//   const navigate = useNavigate();

//   // **Define fetchNotes function here**  // Ensures function is accessible within useEffects
//   const fetchNotes = async () => {
//     setIsLoading(true); // Set loading state to true
//     setError(null); // Clear any previous errors

//     try {
//       const response = await axios.get('http://localhost:5000/get-note');
//       const resetResponse = await axios.patch('http://localhost:5000/reset-writing');
//       setNotes(response.data);
//       setCurrentNoteId(response.data.length);
//     } catch (error) {
//       console.error('Fetch-Note Error:', error);
//       setError(error.message); // Set error message
//     } finally {
//       setIsLoading(false); // Set loading state to false after fetching or error
//     }
//   };

//   useEffect(() => {
//     fetchNotes();
//   }, [currentNoteId]);

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/delete-note/${id}`);
//       fetchNotes();
//     } catch (error) {
//       console.error('Delete-Note Error:', error);
//       setError(error.message);
//     }
//   };

//   const handleKeyPress = (event) => {
//     const { key, ctrlKey } = event; 

//     if (key === 'Enter') {
//       navigate(`/create-note/${currentNoteId + 1}`);
//     } else if (key === 'Delete' || key === 'Backspace') {
//       const focusedElement = document.activeElement;
//       if (focusedElement.classList.contains('bg-white') && focusedElement.textContent === 'Delete') {
//         focusedElement.click();
//       }
//     } else if (ctrlKey && key === 'E') { // Edit note shortcut (Ctrl+E)
//       const focusedNote = focusedNoteRef.current; // Use ref to get focused note
//       if (focusedNote) {
//         const noteId = focusedNote.dataset.noteId;
//         navigate(`/edit-note/${noteId}`); // Navigate to edit page with note ID
//       }
//     } else if (ctrlKey && key === 'D') { // Delete note shortcut (Ctrl+D) with confirmation
//       const focusedNote = focusedNoteRef.current;
//       if (focusedNote) {
//         const noteId = focusedNote.dataset.noteId;
//         if (window.confirm('Are you sure you want to delete this note?')) {
//           handleDelete(noteId);
//         }
//       }
//     } else {
//       // Update focusedNoteRef based on keyboard navigation (e.g., arrow keys)
//       // ... (implementation details depend on your desired navigation behavior)
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('keydown', handleKeyPress);

//     return () => document.removeEventListener('keydown', handleKeyPress);
//   }, []); // Empty dependency array to attach the event listener once
//   return (
//     <div className="bg-blue-200 w-screen h-screen p-12" onKeyDown={handleKeyPress}>
//       {/* ... (rest of your code) ... */}
//       <Link to={`/create-note/${currentNoteId + 1}`}>
//         <button className="bg-white">Create Note (set param = last id)</button>
//       </Link>
//       <div className="mt-4 bg-blue-400 w-60 h-2" />
//       {notes.length > 0 && ( // Show notes section only if there are notes
//         <div className="mt-2">Fetched Notes:</div>
//       )}
//       {notes.map((note, index) => (
//         <div key={index} className="mt-2" ref={focusedNoteRef} data-note-id={note.note_id}>  {/* Assign ref and data-note-id */}
//           {note.note_title} {note.note_content} id:{note.note_id}
//           <Link to={`/edit-note/${note.note_id}`}>
//             <button className="bg-white ml-3 p-2">Edit (Ctrl+E)</button>
//           </Link>
//           <button className="bg-white ml-3 p-2" onClick={() => handleDelete(note.note_id)}>
//             Delete (Ctrl+D)
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }
// export default App;