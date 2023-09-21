import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSocket } from '../providers/Socket'
import { socketActions } from '../socketActions'
import { usePeer } from '../providers/Peer'
import ReactPlayer from 'react-player'
import { Button } from '@chakra-ui/react'

const Room = () => {
    const { roomId } = useParams()
    const { socket } = useSocket()
    const { peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream } = usePeer()

    const [myStream, setMyStream] = useState(null)
    const [remoteEmail, setRemoteEmail] = useState(null)

    const handleNegotiation = useCallback(async () => {
        // console.log('negotiation needed')
        const localOffer = await createOffer()
        socket.emit(socketActions.CALL_USER, { email: remoteEmail, offer: localOffer })
    }, [createOffer, remoteEmail, socket])

    useEffect(() => {
        peer.addEventListener('negotiationneeded', handleNegotiation)
        return () => {
            peer.removeEventListener('negotiationneeded', handleNegotiation)
        }
    }, [handleNegotiation, peer])

    const handleNewUserJoined = useCallback(async ({ email }) => {
        // console.log('new user joined: ', email)
        const offer = await createOffer()
        socket.emit(socketActions.CALL_USER, { email, offer })
        setRemoteEmail(email)
    }, [socket, createOffer])

    const handleIncomingCall = useCallback(async ({ from, remoteOffer }) => {
        // console.log('incoming call from: ', from)
        const answer = await createAnswer(remoteOffer)
        socket.emit(socketActions.CALL_ACCEPTED, { from, answer })
        setRemoteEmail(from)
    }, [createAnswer, socket])

    const handleCallAcceptedResponse = useCallback(async ({ answer }) => {
        console.log('call accepted');
        await setRemoteAnswer(answer)
    }, [setRemoteAnswer])

    useEffect(() => {
        socket.on(socketActions.NEW_USER_JOINED, handleNewUserJoined)
        socket.on(socketActions.INCOMING_CALL, handleIncomingCall)
        socket.on(socketActions.CALL_ACCEPTED_RES, handleCallAcceptedResponse)

        return () => {
            socket.off(socketActions.NEW_USER_JOINED, handleNewUserJoined)
            socket.off(socketActions.INCOMING_CALL, handleIncomingCall)
            socket.off(socketActions.CALL_ACCEPTED_RES, handleCallAcceptedResponse)
        }

    }, [socket, handleNewUserJoined, handleIncomingCall, handleCallAcceptedResponse])


    const getUserMediaStream = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true, video: true
        })
        setMyStream(stream)
    }, [])

    useEffect(() => {
        getUserMediaStream()
    }, [getUserMediaStream])

    const videoWindowStyle = {
        width: '200px',
        height: '200px'
    }

    return (
        <div> 
            <h1>Room - {roomId}</h1>
            <h3>connected to: {remoteEmail}</h3>
            <ReactPlayer url={myStream} playing muted/>
            <ReactPlayer url={remoteStream} playing muted />
            <Button onClick={() => sendStream(myStream)}>
                Send My Video
            </Button>
        </div>
    )
}

export default Room
