// pages/index.js


import Head from 'next/head';
import { useRef, useState } from 'react';
import Webcam from 'react-webcam'; // Import the Webcam component
import axios from 'axios';


const Home = () => {
  const webcamRef = useRef(null);
  const [dragPositions, setDragPositions] = useState({});
  const [deskewedText, setDeskewedText] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);

  // Function to handle drag events and update positions
  const handleDrag = (id, e, ui) => {
    setDragPositions({ ...dragPositions, [id]: ui });
  };

  // Capture an image from the webcam
  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const formData = new FormData();

    // Attach the image and dragPositions data to the FormData object
    formData.append('image', imageSrc);
    formData.append('positions', JSON.stringify(dragPositions));

    try {
      const response = await axios.post('/api/deskew', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        setDeskewedText(response.data.deskewed_text);
        setCapturedImage(`data:image/jpeg;base64,${response.data.deskewed_image}`);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Request Error:', error);
    }
  };

  return (
    <div>
      <Head>
        <title>Webcam Deskewing</title>
        <meta name="description" content="Webcam Deskewing App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Webcam Deskewing</h1>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <Webcam ref={webcamRef} />
              {Object.keys(dragPositions).map((id) => (
                <Draggable
                  key={id}
                  onDrag={(e, ui) => handleDrag(id, e, ui)}
                  position={dragPositions[id]}
                >
                  <div className="outline" />
                </Draggable>
              ))}
              <button className="btn btn-primary mt-3" onClick={capture}>
                Capture and Deskew
              </button>
            </div>
            <div className="col-md-6">
              {capturedImage && (
                <img src={capturedImage} alt="Deskewed" />
              )}
              {deskewedText && (
                <div className="mt-3">
                  <h2>Deskewed Text:</h2>
                  <p>{deskewedText}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
