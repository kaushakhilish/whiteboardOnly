import { useContext } from "react"
import { BoardContext } from "../context/boardContext";
import styles from './boardCard.module.css';

export default function BoardCard({ board, setPage }) {
    const { setWhiteboard } = useContext(BoardContext);

    const boardCardClick = () => {
        setPage('whiteboard');
        console.log('board', board)
        setWhiteboard(board);
    }

    return (
        <div className={styles.boardCard} onClick={boardCardClick}>
            <h2 >
                {board.name}
            </h2>
        </div>
    )
}