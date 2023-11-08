import { React, useEffect, useState } from "react";
import serverReqs from "../utils/serverReqs";
import {v4 as uuidv4} from 'uuid'

export default function GameDisp({ newNoti }) {
  const [imageList, setImageList] = useState([]);
  const [remain, setRemain] = useState(null)
  const [imgId, setImgId] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [easy, setEasy] = useState(false);
  const [charList, setCharList] = useState([]);
  const [inputDisp, setInputDisp] = useState(true);
  const [guess, setGuess] = useState([0, 0]);
  const [charGuess, setCharGuess] = useState("");
  const [score, setScore] = useState(0);
  const [player, setPlayer] = useState(undefined);
  const [imgSize, setImgSize] = useState([])

  const fetchList = async () => {
    const images = await serverReqs.getImageList();

    //error handling, toast noti
    if (images.err) {
      newNoti('Error accessing image list', 'fail')
      return
    }
    console.log(images)
    newNoti(`${images.length} pulled from database`, 'win')
    setImageList(images);
  };

  const fetchImg = async () => {
    if (imageList.length < 1) return
    const rand = Math.floor(Math.random() * (imageList.length - 1));
    const id = imageList[rand]._id;
    console.log(`id: ${id}`)
    const img = await serverReqs.getImage(id);
    if (img.err) {
      newNoti('Unable to get image details', 'fail')
    }
    //const blob = await img.blob().catch(err => console.error('Error w/ blob', err));
    const url = URL.createObjectURL(img);
    setRemain(imageList[rand].chars.length)
    setImageUrl(url);
    setImgId(id);
    newNoti('Game ready', 'win')
  };


  //I think we'll have to pick the image on client side and request it by
  //ID from the server so the ID is saved client side in state

  useEffect(() => {
    const first = async () => {
      setEasy(false)
      try {
        await fetchList()
        console.log('list acquired')
        newNoti('Loading game..', 'win')  
      } catch(err) {
        console.log(err)
      }
    }
    first()

    //cleanup
    return () => {
      setImageList([])
    }
  }, []);

  useEffect(() => {
    fetchImg()

    //cleanup
    return () => {
      setImageUrl(null)
      setImgId('')
    }
  }, [imageList])

  function refresh(bool) {
    if (imageList.length < 2) {
      newNoti('This is the last image. Submit your score!', 'fail')
      return
    }
    const newList = imageList.filter((obj) => obj._id !== imgId);
    console.log(newList)
    setImageList(newList);
    setInputDisp(true)
    const notiMsg = bool ? 'Nice! You got them all!' : 'Skipping that one...'
    newNoti(notiMsg, 'win')
  }

  function handleInput(e) {
    setCharGuess(e.target.value);
  }

  function handleGuess(e) {
    console.log(`X: ${e.target.clientWidth}, Y: ${e.target.clientHeight}`)
    setImgSize([e.target.clientWidth, e.target.clientHeight])
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
      console.log(chars)
      setCharList(chars);
    } else {
      setEasy(false)
      newNoti('Hints off', 'win')
    }
  }

  const options =
    easy === false ? (
      <option value="" />
    ) : (
      charList.map((char) => <option key={uuidv4()} value={char} />)
    );

  async function handleSubmit() {
    const body = {
      id: imgId,
      name: charGuess,
      guess,
      size: imgSize,
    };
    const response = await serverReqs.submitGuess(body);
    if (response.err) {
      newNoti('Error submitting to database', 'fail')
      return
    }
    //answer checking
    if (response.result === 1) {
      //resetting
      setScore(score + 1);
      setCharGuess('')
      setInputDisp(true)
      setGuess([])
      setImgSize([])


      //next image if all chars found
      if (remain < 2) {
        setEasy(false)
        refresh(true);
      } else {
        setRemain(remain - 1)
        newNoti('You got it! Now get the rest', 'win')
      }

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
    setCharGuess('')
    setInputDisp(true)
    setGuess([])
    setImgSize([])
    setEasy(false)
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
        <button className="refresh" onClick={() => refresh(false)}>
            skip
          </button>
        <button onClick={endGame}>End game</button>
      </div>
      <div className="imgView">
        <p>Image: {imgId}</p>
        <p>Hints are {easy ? 'on' : 'off'}</p>
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
