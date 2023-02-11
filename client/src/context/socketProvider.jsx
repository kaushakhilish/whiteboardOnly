import { createContext, useState } from "react";

export const SocketContext = createContext(null);

const SocketProvider = (props) => {
    const [socket, setSocket] = useState(null);

    return (
        <SocketContext.Provider value={{socket, setSocket}}>
            {props.children}
        </SocketContext.Provider>
    )
}
export default SocketProvider;