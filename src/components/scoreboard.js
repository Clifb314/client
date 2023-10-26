import {React, useEffect, useState} from "react";
import serverReqs from "../utils/serverReqs";


export default function Scoreboard() {
    
    const [scores, setScores] = useState([])

    useEffect(() => {
        const getScores = async () => {
            try {
                const reqScores = await serverReqs.getScores()
                setScores([...reqScores])
            } catch {
                //toast noti?
            }
        }
        getScores()
    }, [])

    const display = scores.map(score => {
        return (
            <tr>
                <td>{score.name}</td>
                <td>{score.score}</td>
                <td>{score.date}</td>
            </tr>
        )
    })

    return (
        <div className="scoreboard">
            <table>
                <th>Player</th>
                <th>Score</th>
                <th>Date</th>
                {display}
            </table>
        </div>
    )
}