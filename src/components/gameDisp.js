import { React, useEffect, useState } from "react";
import serverReqs from "../utils/serverReqs";


export default function GameDisp() {
    const [filename, setFilename] = useState('')
    const [imageUrl, setImageUrl] = useState(null)
    const [guess, setGuess] = useState([0, 0])
    

    const fetchImg = async () => {
        const img = await serverReqs.getImage()
        const blob = await img.blob()
        const url = URL.createObjectURL(blob)
        setImageUrl(url)
    }

    //I think we'll have to pick the image on client side and request it by
    //ID from the server so the ID is saved client side in state

    useEffect(() => {
        fetchImg()
    }, [])

    function handleGuess(e) {
        setGuess(e.offsetX, e.offsetY)
    }

    return (
        <div className="gameDisp">
            <div className="imgView">
                <p>Image: {filename}</p>
                <img src={imageUrl} onClick={handleGuess} alt="Image for guessing game" />
                <button className="refresh" onClick={fetchImg}>Refresh</button>
                <p>Current position:</p>
                <p>X: {guess[0]}, Y: {guess[1]}</p>
            </div>
        </div>
    )


}