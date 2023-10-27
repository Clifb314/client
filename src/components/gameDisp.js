import { React, useEffect, useState } from "react";
import serverReqs from "../utils/serverReqs";

export default function GameDisp() {
  const [imgId, setImgId] = useState("");
  const [imageList, setImageList] = useState([]);
  const [charList, setCharList] = useState([])
  const [imageUrl, setImageUrl] = useState(null);
  const [inputDisp, setInputDisp] = useState(true);
  const [guess, setGuess] = useState([0, 0]);
  const [charGuess, setCharGuess] = useState("");
  const [score, setScore] = useState(0);
  const [easy, setEasy] = useState(false);
  const [player, setPlayer] = useState(undefined)

  const fetchList = async () => {
    const images = await serverReqs.getImageList();
    //error handling, toast noti
    setImageList([...images]);
  };

  const fetchImg = async () => {
    const rand = Math.floor(Math.random() * (list.length - 1));
    const id = imageList[rand]._id;
    const img = await serverReqs.getImage(id);
    const blob = await img.blob();
    const url = URL.createObjectURL(blob);
    setImageUrl(url);
    setImgId(id);
  };

  //I think we'll have to pick the image on client side and request it by
  //ID from the server so the ID is saved client side in state

  useEffect(() => {
    fetchList();

    fetchImg();
  }, []);

  function refresh() {
    const newList = list.filter((obj) => obj._id !== imgId);
    setImageList([...newList]);
    fetchImg();
  }

  function handleInput(e) {
    setCharGuess(e.target.value);
  }

  function handleGuess(e) {
    setGuess(e.offsetX, e.offsetY);
    setInputDisp(false);
  }

  async function easyMode() {
    if (!easy) {
        setEasy(true);
        const chars = await serverReqs.getHints()
        setCharList([...chars])
    }

  }

  const options = easy === false ? <option value='' /> : charList.map(char => <option value={char} />)

  async function handleSubmit() {
    const body = {
      id: imgId,
      name: charGuess,
      x: guess[0],
      y: guess[1],
    };
    const response = await serverReqs.submitGuess(body.json());
    if (response.result === 1) {
      //toast noti?
      setScore(score + 1);
      refresh();
    }
    //toast noti
  }

  function getName(e) {
    if (e.target.value === '') setPlayer(undefined)
    else setPlayer(e.target.value)
  }

  async function endGame() {
    const body = {
        score,
        name: player //fix this
    }
    const response = await serverReqs.endGame(body.json())
    //error handling, notifs
    setScore(0)
    fetchList()
    fetchImg()
  }

  return (
    <div className="gameDisp">
      <p>Score: {score}</p>
      <button onClick={easyMode}>Toggle hints</button>
      <button onClick={endGame}>End game</button>
      <label htmlFor="player">Player Name: </label>
      <input value={player === undefined ? '' : player} onChange={getName} />
      <div className="imgView">
        <p>Image: {filename}</p>
        <img
          src={imageUrl}
          onClick={handleGuess}
          alt="Image for guessing game"
        />
        <button className="refresh" onClick={refresh}>
          Refresh
        </button>
        <p>Current position:</p>
        <p>
          X: {guess[0]}, Y: {guess[1]}
        </p>
        <input value={charGuess} list="chars" onChange={handleInput} hidden={inputDisp} />
        <datalist id="chars" hidden={inputDisp || !easy}>{options}</datalist>
        <button hidden={inputDisp} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
