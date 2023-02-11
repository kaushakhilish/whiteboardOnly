import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from "socket.io-client";
import { SocketContext } from './socketProvider';
export const BoardContext = createContext({});
import { URL } from './appContext';

// export const URL = 'http://localhost:4000';

//Shapes constants
export const SHAPES = {
    PENCIL: 'pencil',
    RECTANGLE: 'rectangle',
    CIRCLE: 'circle',
    TRIANGLE: 'triangle',
    DIAMOND: 'diamond',
    HEXAGON: 'hexagon',
    LINE: {
        SIMPLE: 'simple',
        ONE_ARROW: 'one_arrow',
        TWO_ARROW: 'two_arrow',
    },
    TEXT: 'text',
}

//Button Constants
export const BUTTONS = {
    SELECT: {
        SELECT: 'select',
        MOVE: 'move',
    },
    DRAW: {
        PENCIL: SHAPES.PENCIL,
        HIGHLIGHTER: 'highlighter',
    },
    SHAPES: {
        RECTANGLE: SHAPES.RECTANGLE,
        CIRCLE: SHAPES.CIRCLE,
        TRIANGLE: SHAPES.TRIANGLE,
        DIAMOND: SHAPES.DIAMOND,
        HEXAGON: SHAPES.HEXAGON,
    },
    LINE: SHAPES.LINE,
    TEXT: SHAPES.TEXT,
    NOTES: 'notes',
    UPLOAD: 'upload',
    ERASOR: 'erasor',
    COLORS: 'colors',
}

//Stroke sizes constants
export const STROKE_SIZES = {
    STROKE_THIN: 'stroke_thin',
    STROKE_MID: 'stroke_mid',
    STROKE_THICK: 'stroke_thick',
}

const BoardContextProvider = ({ children }) => {
    const [selectedBtn, setSelectedBtn] = useState(BUTTONS.SELECT.SELECT);
    const [selectedStrokeSize, setSelectedStrokeSize] = useState(STROKE_SIZES.STROKE_MID);
    const [selectedStrokeColor, setSelectedStrokeColor] = useState('#000');
    const [selectedFillColor, setSelectedFillColor] = useState('none');
    const [whiteboard, setWhiteboard] = useState(null);
    const [allWhiteboards, setAllWhiteboards] = useState(null);

    const { socket, setSocket } = useContext(SocketContext);

    useEffect(() => {
        console.log('board from context', whiteboard)
        if (whiteboard) {
            let roomId = whiteboard._id;
            let id = Math.random();

            console.log('id', roomId)
            if (roomId && id) {
                let newSocket = io(URL, {
                        query: { roomId, id },
                        transports: ['websocket'],
                    }
                );
                console.log('socket', newSocket)
                if(newSocket){
                    console.log('socket', newSocket);
                    setSocket(newSocket)
                    return () => { newSocket.close() };
                }
            }
        }
    }, [whiteboard]);

    return (
        <BoardContext.Provider value={{
            selectedBtn,
            setSelectedBtn,
            selectedStrokeSize,
            setSelectedStrokeSize,
            selectedStrokeColor,
            setSelectedStrokeColor,
            selectedFillColor,
            setSelectedFillColor,
            whiteboard,
            setWhiteboard,
            allWhiteboards,
            setAllWhiteboards
        }}>
            {children}
        </BoardContext.Provider>
    );
}

export default BoardContextProvider;
