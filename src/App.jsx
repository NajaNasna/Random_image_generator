import { Form } from 'react-bootstrap'
import './index.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'


const API_URL = 'https://api.unsplash.com/search/photos'
const IMAGES_PER_PAGE = 20;


function App() {
const searchInput = useRef(null)
const [images,setImages] = useState([]);
const [page,setPage] = useState(1)
const [totalPages,setTotalPages] = useState(0)
const [errorMsg, setErrorMsg] = useState('')



const fetchImages = useCallback (async () => {
  try{
    if(searchInput.current.value){
      setErrorMsg('')
      const {data} = await axios.get(`${API_URL}?query=${searchInput.current.value}&page=${page}&per_page=${IMAGES_PER_PAGE}`,   
      {
       headers: {
         Authorization: `Client-ID ${import.meta.env.VITE_API_KEY}`,
       },
      });
       setImages(data.results);
      //  console.log(images)
       setTotalPages(data.total_pages)
    }  
  }
  catch(error){
    setErrorMsg('Error fetching images. Try again later...')
    console.log(error)
  }
},[page]);


useEffect(() =>{
  fetchImages();
  searchInput.current.focus()
},[fetchImages])

console.log('key',import.meta.env.VITE_API_KEY)       // if we use create-react-app or webpack we can access the api key using console.log(process.env.VITE_API_KEY)

const resetSearch = () =>{
  setPage(1)
  fetchImages()
}

const handleSearch = (event) =>{
  event.preventDefault();
 // console.log(searchInput.current.value)
  resetSearch()
};

const handleSelection = (selection) =>{
  searchInput.current.value = selection
  resetSearch()
}


return (
<div className='container'>
    <center><h1 className='title'>Image Search</h1></center>
    {errorMsg && <p>{errorMsg} </p>}


  <div className="search-section">
    <Form onSubmit={handleSearch}>
     {/* putting the below input box inside the above html form tag will cause the search to occur on pressing the enter button */}
    <Form.Control 
      className='search-box'
      type="search" 
      placeholder="Type something to search..." 
      ref={searchInput}
    />    
    </Form>
  </div>

  <div className="filters">
    <button  onClick={() => handleSelection('Nature')}>Nature</button>
    <button onClick={() => handleSelection('Birds')}>Birds</button>
    <button onClick={() => handleSelection('Cats')}>Cats</button>
    <button onClick={() => handleSelection('Shoes')}>Shoes</button>
  </div>

  <div className="images">
    {images.map((image) =>
      
      // {
        // return (
        //   <img 
        //   key={image.id}
        //   src={image.urls.small}
        //   alt={image.alt_description}
        //   className='image'
        //   />
        // )  }
        // or we can also write without using return using es6 syntax directly as shown below

  (
    <img
      key={image.id}
      src={image.urls.small}
      alt={image.alt_description}
      className='image'

    />
 )
)}
 </div>

 <div className="buttons">
  <span>
  {page > 1 && <button className='previous' onClick={() => setPage(page-1)}>Previous</button>}
  </span>
  <span>{page < totalPages && <button className='next' onClick={() => setPage(page+1)}>Next</button>}

  </span>
  </div>
</div>
)
}

export default App
