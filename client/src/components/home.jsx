import React, { useContext, useEffect } from 'react';
import { BoardContext } from '../context/boardContext';
import { URL } from '../context/appContext';
import BoardCard from './boardCard';
import styles from './home.module.css';

const Home = ({ setPage }) => {
    const { allWhiteboards, setAllWhiteboards } = useContext(BoardContext);

    useEffect(() => {
        async function getBoards() {
            try {
                let res = await fetch(URL + 'whitebaords');
                let data = await res.json();
                console.log('data', data)
                setAllWhiteboards(data)
            } catch (err) {
                console.log('Error getting Boards', err)
            }
        }
        getBoards()

        return () => { };
    }, []);

    function createNewBoard() {

    }

    return (
        <div className={styles.home}>
            <button onClick={createNewBoard} className={styles.creaWhiteboardBtn}>Create New Whiteboard!</button>
            {
                allWhiteboards &&
                allWhiteboards.map(brd => {
                    return <BoardCard setPage={setPage} key={brd._id} board={brd} />
                })
            }
        </div>
    );
}

export default Home;
