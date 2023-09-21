import React, { createContext, useContext, useMemo } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)

export const useSocket = () => useContext(SocketContext)

const SocketProvider = ({ children }) => {
    const socket = useMemo(() => {
        return io('http://localhost:8001')
    }, [])
    return (
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider
