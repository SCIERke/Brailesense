import React , { useState , useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

function CreateNote() {
  const [title ,setTitle] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const handleChange = (event) => {
    setTitle(event.target.value);
  }
  
  const handleSubmit = async (event) => {
    //api create note
    const noteData = {
      note_title: title,
      note_content: "" ,
      note_id: id ,
      note_writing: false,
      note_reading: false,
      pos_reading: 0,
    }
    try {
      const response = await axios.post('http://localhost:5000/create-note', noteData);
      console.log("OK");
      if (response.status === 200) {
        navigate('/');
      } else {
        console.error("API call unsuccessful:", response.statusText);
      }
    } catch (error) {
      console.error("There was an error creating the note!", error);
    }
  }

  
  return (
    <div className='bg-blue-200 p-12 h-screen flex flex-col'>
      <div className='font-bold text-5xl'>Create your Note {id}</div>
      <form onSubmit={handleSubmit} className='my-6'>
          <label className='mr-4 text-2xl font-semibold ml-7'>
            Title :
            <input type="text" value={title} className='bg-white p-2 focus:bg-blue-300 ml-2 px-96' onChange={handleChange} />
          </label>
      </form>
      <Link to='/' className="bg-white ml-3 p-2 px-96 focus:bg-blue-300 justify-center text-center">
        Home
      </Link>
    </div>
  )
}

export default CreateNote
