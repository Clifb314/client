import { React, useEffect, useState } from "react";
import serverReqs from "../utils/serverReqs";
import { v4 as uuidv4 } from "uuid";

export default function Scoreboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const getScores = async () => {
      try {
        const reqScores = await serverReqs.getScores();
        const set = reqScores.scores
        for (const score of set) {
          const setDate = new Date(score.date).toLocaleString()
          score.date = setDate
        }
        setScores([...set]);
      } catch(err) {
        console.log(err)
      }
    };
    getScores();
  }, []);

  const display = scores.map((score) => {
    return (
      <tr key={uuidv4()}>
        <td>{score.name}</td>
        <td>{score.score}</td>
        <td>{score.date}</td>
      </tr>
    );
  });

  return (
    <div className="scoreboard">
      <table>
        <caption>Scoreboard</caption>
        <thead>
          <tr>
            <th className="player" scope="col">Player</th>
            <th scope="col">Score</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>{display}</tbody>
      </table>
    </div>
  );
}
