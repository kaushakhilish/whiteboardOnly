import React, { useState, useEffect } from 'react';
import ShapeCover from './shapeCover';

const RenderText = ({ shape, onClick, onMouseMove }) => {
    const [text, setText] = useState([]);

    useEffect(() => {
        let textParts = shape?.props?.value?.split('\n');
        console.log(textParts)
        setText(textParts)
        return () => { };
    }, []);
    return (
        <ShapeCover shape={shape}>
            <text
                id={shape.id}
                key={shape.id}
                x={shape.props.x}
                y={shape.props.y}
                style={shape.style}
                onClick={onClick}
                onMouseMove={onMouseMove}
            >
                {text?.map((txt, i) => <tspan id={shape.id} x={shape.props.x} dy={i * 20}>{txt}<br /></tspan>)}
            </text>
        </ShapeCover>
    );
}

export default RenderText;
