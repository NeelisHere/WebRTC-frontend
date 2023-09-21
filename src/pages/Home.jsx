import { Box, Stack, Input, Button, Text } from "@chakra-ui/react"
import { useSocket } from "../providers/Socket"
import { useCallback, useEffect, useState } from "react"
import { socketActions } from "../socketActions"
import { useNavigate } from "react-router-dom"

const Home = () => {
    const { socket } = useSocket()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [roomId, setRoomId] = useState('')

    const handleJoinRoomSuccess = useCallback(({ roomId }) => {
        navigate(`/room/${roomId}`)
    }, [navigate])

    const handleJoinRoom = async (e) => {
        e.preventDefault()
        socket.emit(socketActions.JOIN_ROOM_REQ, { roomId, email })
    }

    useEffect(() => {
        socket.on(socketActions.JOIN_ROOM_SUCCESS_RES, handleJoinRoomSuccess)
        return () => {
            socket.on(socketActions.JOIN_ROOM_SUCCESS_RES, handleJoinRoomSuccess)
        }
    }, [handleJoinRoomSuccess, socket])

    return (
        <Box
            border={'2px solid red'}
            width={'300px'}
            p={'20px'}
        >
            <Stack spacing={3}>
                <Text fontSize={'2xl'} fontWeight={'bold'} textAlign={'center'} mb={'20px'}>
                    Enter Room Details
                </Text>
                <Input 
                    variant='filled' 
                    placeholder='Enter email' 
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value)
                    }}
                />
                <Input 
                    variant='filled' 
                    placeholder='Enter room-code'
                    value={roomId}
                    onChange={(e) => {
                        setRoomId(e.target.value)
                    }} 
                />
                <Button 
                    colorScheme={'teal'} 
                    w={'100%'} 
                    mt={'30px'}
                    onClick={handleJoinRoom}
                >
                    Join Room
                </Button>

            </Stack>
        </Box>
    )
}

export default Home
