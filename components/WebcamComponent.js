// components/WebcamComponent.js

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

const WebcamComponent = () => {
  const webcamRef = useRef(null);
  const [dragPositions, setDragPositions] = useState({});
  const [deskewedImage, setDeskewedImage] = useState(null);

  // Function to capture an image from the webcam and deskew it
  const captureAndDeskew = async () => {
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
        setDeskewedImage(response.data.deskewedImage);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Request Error:', error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <Webcam ref={webcamRef} />
          {/* Draggable outline */}
          <div
            className="outline"
            style={{
              width: '100px',
              height: '100px',
              border: '2px dashed red', // Adjust the border style and color as needed
              position: 'absolute',
              zIndex: 100,
              pointerEvents: 'auto', // Enable interaction with the outline
              ...dragPositions['outline'], // Apply drag positions
            }}
            // Event handlers for drag and update positions
            onMouseDown={(e) => e.preventDefault()} // Prevent text selection during drag
          />
          <button className="btn btn-primary mt-3" onClick={captureAndDeskew}>
            Capture and Deskew
          </button>
        </div>
        <div className="col-md-6">
          {deskewedImage && (
            <img src={`data:image/jpeg;base64,${deskewedImage}`} alt="Deskewed" />
          )}
        </div>
      </div>
    </div>
  );
};

export default WebcamComponent;
