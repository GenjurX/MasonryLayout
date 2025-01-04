import 'bootstrap/dist/css/bootstrap.min.css';
import Masonry from 'react-masonry-css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Fancybox from './components/Fancybox.jsx';
import { useEffect,useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

function App() {

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  //The access token from Pexels website, imported from the .env file
  const accessKey = import.meta.env.VITE_PEXELS_ACCESS_KEY;

  //Fetching the first group of 7 images, it will only run once
  useEffect(()=>{
    loadMoreImages();
  },[]);

  //The function used for fetching images, using the pexels API
  const fetchImages = async (page) => {
    try{
      let result = [];

      const response = await fetch(`https://api.pexels.com/v1/curated?page=${page}&per_page=7`, {
        headers: {
          Authorization: accessKey,
        },
      });
      
      //If the fetch request fails, throw an error in the console
      if(!response.ok){
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      // console.log(data.photos);
  
      //Returning an array of objects including the source for medium sized version and the original size version for each picture
      result = data.photos.map((photo) =>({
        medium: photo.src.medium,
        original: photo.src.original,
      }));
  
      return result;
    }
    catch(error){
      console.error("Error fetching images:", error);
    }

   };

  //The function for loading the next set of 7 images, unique from the previously fetched images
  const loadMoreImages = async () => {

    //Prevent duplicate API call if the previous one has not ended successfully
    if (loading) return;
    setLoading(true);

    const newImages = await fetchImages(page);
    // console.log("newImages",newImages);
    setImages((prevImg) => {

      /*Avoiding duplicate images from the new fetch request*/
      //Creating a Set data structure with only unique urls
      const newImageUrls = new Set(prevImg.map((img)=> img.original));

      const uniqueImages = newImages.filter((newImg)=>{
        if(!newImageUrls.has(newImg.original)){
          newImageUrls.add(newImg.original);//Add the new Url to the newImageUrls Set data structure

          return true;//Keep the image in the filtered array uniqueImages
        }
        else{
          return false;//Do not keep the image in the uniqueImages array
        }
      });

      // Concatenate unique images to the existing state
      return [...prevImg,...uniqueImages];
    });
    setPage((prevPage) => prevPage+1);

    // console.log(images);
    setLoading(false);
  }


  const breakpointColumns = {
    default: 4, // Number of columns for default screen size
    992: 3,    // Number of columns below 992px width
    768: 2,     // Number of columns below 768px width
    576: 1,     // Number of columns below 576px width
  };

  return (
    <>
        <Header />
        <div id='mainSection' className='container' >
                <InfiniteScroll
                  dataLength={images.length}
                  next={loadMoreImages}
                  hasMore={true}
                  loader={<h4>Loading...</h4>}
                >
        <Fancybox
          options={{
            Toolbar: {
              display: {
                left: ["infobar"],
                middle: [
                  "zoomIn",
                  "zoomOut",
                  "toggle1to1",
                  "rotateCCW",
                  "rotateCW",
                  "flipX",
                  "flipY",
                ],
                right: ["slideshow", "thumbs", "close"],
              },
            },
            Thumbs: false,
            Carousel: {
              infinite: false, 
            },
          }}
        >
          <Masonry
            breakpointCols={breakpointColumns}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {images.map((src,index) => (
              <div key={index}  className={`grid-item`}>
                {/* Wrap each image with Fancybox anchor tag */}
                <a data-fancybox="gallery" href={src.original}>
                  <img
                    src={src.medium}
                    alt={`Masonry Item`}
                    className="img-fluid rounded"
                  />
                </a>
              </div>
            ))}
          </Masonry>
        </Fancybox>
        </InfiniteScroll>
        </div>
        <Footer />
    </>
  );
}

export default App

