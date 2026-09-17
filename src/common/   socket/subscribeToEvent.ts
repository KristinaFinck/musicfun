import type { Socket } from 'socket.io-client'
import {getSocket} from "@/common/   socket/getSocket.ts";
import {SocketEvents} from "@/common/constants/constants.ts";

type Callback<T> = (data: T) => void

export const subscribeToEvent = <T>(event: SocketEvents, callback: Callback<T>) => {
    const socket: Socket = getSocket()
    socket.on(event, callback)

    return () => {
        socket.off(event, callback)
    }
}
