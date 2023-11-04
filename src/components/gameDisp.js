import { React, useEffect, useState } from "react";
import serverReqs from "../utils/serverReqs";

export default function GameDisp({ newNoti }) {
  const [imgId, setImgId] = useState("");
  const [imageList, setImageList] = useState([]);
  const [charList, setCharList] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [inputDisp, setInputDisp] = useState(true);
  const [guess, setGuess] = useState([0, 0]);
  const [charGuess, setCharGuess] = useState("");
  const [score, setScore] = useState(0);
  const [easy, setEasy] = useState(false);
  const [player, setPlayer] = useState(undefined);

  const fetchList = async () => {
    const images = await serverReqs.getImageList();

    //error handling, toast noti
    if (images.err) {
      newNoti('Error accessing image list', 'fail')
      return
    }
    const imgArr = images.images
    console.log(imgArr)
    newNoti(`${imgArr.length} pulled from database`, 'win')
    setImageList(imgArr);
    console.log(imageList)
    return
  };

  const fetchImg = async () => {
    const rand = Math.floor(Math.random() * (imageList.length - 1));
    console.log(`random: ${rand}`)
    const id = imageList[rand]._id;
    console.log(`id: ${id}`)
    const img = await serverReqs.getImage(id);
    if (img.err) {
      newNoti('Unable to get image details', 'fail')
    }
    //const blob = await img.blob().catch(err => console.error('Error w/ blob', err));
    const url = URL.createObjectURL(img);
    setImageUrl(url);
    setImgId(id);
    newNoti('Game starting..', 'win')
    return
  };


  //I think we'll have to pick the image on client side and request it by
  //ID from the server so the ID is saved client side in state

  useEffect(() => {
    const first = async () => {
      try {
        await fetchList()
        console.log('list acquired')
        newNoti('Loading game..', 'win')  
      } catch(err) {
        console.log(err)
      }
    }
    first()
  }, []);

  useEffect(() => {
    fetchImg()
  }, [imageList])

  function refresh() {
    if (imageList.length < 2) {
      newNoti('This is the last image. Submit your score!', 'fail')
      return
    }
    const newList = imageList.filter((obj) => obj._id !== imgId);
    console.log(newList)
    setImageList(newList);
    setInputDisp(true)
    newNoti('skipping that one..', 'win')
  }

  function handleInput(e) {
    setCharGuess(e.target.value);
  }

  function handleGuess(e) {
    console.log(`X: ${e.pageX}, Y: ${e.pageY}`)
    setGuess([e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
    setInputDisp(false);
  }

  async function easyMode() {
    if (!easy) {
      setEasy(true);
      const chars = await serverReqs.getHints({id: imgId});
      if (chars.err) {
        console.log(chars)
        newNoti('Error fetching hints', 'fail')
        return
      }
      newNoti('Hints on', 'win')
      setCharList([...chars]);
    } else {
      setEasy(false)
      newNoti('Hints off', 'win')
    }
  }

  const options =
    easy === false ? (
      <option value="" />
    ) : (
      charList.map((char) => <option value={char} />)
    );

  async function handleSubmit() {
    const body = {
      id: imgId,
      name: charGuess,
      x: guess[0],
      y: guess[1],
    };
    const response = await serverReqs.submitGuess(body);
    if (response.err) {
      newNoti('Error submitting to database', 'fail')
      return
    }
    //answer checking
    if (response.result === 1) {
      //toast noti?
      newNoti('You got it!', 'win')
      setScore(score + 1);
      refresh();
    } else if (easy) {
      newNoti(response.hint, 'fail')
    } else {
      newNoti('No Hit! Try again?', 'fail')
    }
  }

  function getName(e) {
    if (e.target.value === "") setPlayer(undefined);
    else setPlayer(e.target.value);
  }

  async function endGame() {
    const body = {
      score,
      name: player,
    };
    const response = await serverReqs.endGame(body);
    //error handling, notifs
    if (response.err) {
      newNoti('Error submitting results', 'fail')
      return
    }
    newNoti('Score sent to server. Want to play again?', 'win')
    setScore(0);
    fetchList();
  }

  return (
    <div className="gameDisp">
      <div className="score">
        <label htmlFor="player">Player Name: </label>
        <input value={player === undefined ? "" : player} onChange={getName} name='player' />
        <p>Score: {score}</p>
        <button onClick={easyMode}>Toggle hints</button>
        <button className="refresh" onClick={refresh}>
            skip
          </button>
        <button onClick={endGame}>End game</button>
      </div>
      <div className="imgView">
        <p>Image: {imgId}</p>
        <img
          src={imageUrl}
          onClick={(e) => handleGuess(e)}
          alt="Image for guessing game"
        />
      </div>
      <div className="answers">
          <p>Current position:</p>
          <p>
            X: {guess[0]}, Y: {guess[1]}
          </p>
          <label htmlFor="guess" hidden={inputDisp}>Who's that??</label>
          <input
            value={charGuess}
            name="guess"
            list="chars"
            onChange={handleInput}
            hidden={inputDisp}
          />
          <datalist id="chars" hidden={inputDisp || !easy}>
            {options}
          </datalist>
          <button hidden={inputDisp} onClick={handleSubmit}>
            Submit
          </button>
      </div>
    </div>
  );
}
