from flask import Flask, request, jsonify
import cv2
import pytesseract
import numpy
from pytesseract import Output


app = Flask(__name__)
@app.route('/')
def home():
    return 'Welcome to the Flask API!'
@app.route('/deskew', methods=['POST'])
def deskew_image():

    
    try:
        # Get the image file from the POST request
        image_file = request.files['image']

        # Read the image using OpenCV
        image = cv2.imdecode(numpy.fromstring(image_file.read(), numpy.uint8), cv2.IMREAD_COLOR)

        # Perform deskewing using OpenCV
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150, apertureSize=3)
        lines = cv2.HoughLines(edges, 1, numpy.pi / 180, 200)

        if lines is not None:
            for rho, theta in lines[0]:
                a = numpy.cos(theta) 


                b = numpy.sin(theta)
                x0 = a * rho
                y0 = b * rho
                x1 = int(x0 + 1000 * (-b))
                y1 = int(y0 + 1000 * (a))
                x2 = int(x0 - 1000 * (-b))
                y2 = int(y0 - 1000 * (a))
                cv2.line(image, (x1, y1), (x2, y2), (0, 0, 255), 2)

        # Extract text from the deskewed image using Tesseract
        deskewed_text = pytesseract.image_to_string(image, output_type=Output.STRING)

        return jsonify({'deskewed_text': deskewed_text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
