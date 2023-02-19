import React from 'react';
import { URL } from '../../context/appContext';

const RenderImage = ({ shape }) => {
    return (
        <image
            id={shape?.id}
            style={shape?.style}
            x={shape?.props.x} y={shape?.props.y} href={URL + 'images/' + shape?.props.filename} height="200" width="200" />
        // <foreignObject x={shape.props.x} y={shape.props.y} width={300} height={300} >
        //     {/* <img width={300} src={URL+'images/'+shape.props.filename} alt="" /> */}
        // </foreignObject>
    );
}

export default RenderImage;
