import React, { useRef, useState } from 'react'
import './ImageGenerator.css'
import default_image from '../Assets/default_image.jpg'

const ImageGenerator = () => {
    // Declare a state variable `image_url` with initial value "/"
    // `setImage_url` is the function used to update this state
    const[image_url, setImage_url] = useState("/");
    let inputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    // an environment variable to store the react api key
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    
    const imageGenerator = async() =>{
        if (inputRef.current.value==="") {
            return 0;
        }

        setLoading(true); //loading starts (on user interface)
        // Sends an HTTP POST request to OpenAI’s image generation API, waiting for the server response.
        const response = await fetch(
            "https://api.openai.com/v1/images/generations",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json", //tells the server (OpenAI's API) we’re sending JSON data.
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    prompt:`${inputRef.current.value}`, // the prompt text the user entered
                    n:1, // number of images to generate
                    size:"512x512", // image size
                }), //The commas are used inside object and array literals to separate multiple key-value pairs or elements.
            }
        ); //Semicolons mark the end of a complete JavaScript statement (no need for the closing brace for the whole class)

        let data = await response.json(); //Wait for the openai api’s JSON response and parse it into JS
        let data_array = data.data;
        setImage_url(data_array[0].url);
        setLoading(false);
    }


    return (
        <div className = 'ai-image-generator'>
            <div className = "header">AI Image <span>Generator</span></div>
            <div className="img-loading">
                {/*If `image_url` equals "/", use the default placeholder image.
                Otherwise, use the actual image URL stored in state. */}
                <div className="image">
                <img
                    src={image_url === "/" ? default_image : image_url}
                    alt=""
                    width="512"
                />
                </div>
                <div className="loading">
                    <div className={loading?"loading-bar-full":"loading-bar"}></div>
                    <div className={loading?"loading-text":"display-none"}>Loading....</div>
                </div>

            </div>
            <div className="search-box">
            <input ref={inputRef} type = "text" className = 'search-input' placeholder='Describe What You Want to See'/>
                 {/*When you click on the 'Generate' button, it will run the imageGenerator function */}
                <div className="generate-btn" onClick={()=>{imageGenerator()}}>Generate</div>
            </div>
        </div>
    )
}

export default ImageGenerator;