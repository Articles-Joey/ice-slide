"use client"
import { useEffect, useRef } from 'react';

import { useIceSlideStore } from '@/hooks/useIceSlideStore';
import { useHotkeys } from 'react-hotkeys-hook';
import { useSocketStore } from '@/hooks/useSocketStore';

export default function ControlsHandler() {

    const launchPlayer = useIceSlideStore(state => state.launchPlayer);
    const setLaunchPlayer = useIceSlideStore(state => state.setLaunchPlayer);
    const hitRotation = useIceSlideStore(state => state.hitRotation);
    const setHitRotation = useIceSlideStore(state => state.setHitRotation);
    const hitPower = useIceSlideStore(state => state.hitPower);
    const setHitPower = useIceSlideStore(state => state.setHitPower);

    const hitRotationRef = useRef(hitRotation);
    useEffect(() => {
        hitRotationRef.current = hitRotation;
    }, [hitRotation]);

    useHotkeys(['Right', 'd'], () => {
        console.log("test", hitRotationRef.current)
        if (hitRotationRef.current >= 360) {
            setHitRotation(0)
            return
        }
        setHitRotation(hitRotationRef.current + 1)
    });
    useHotkeys(['Left', 'a'], () => {
        console.log("test", hitRotationRef.current)
        if (hitRotationRef.current <= 0) {
            setHitRotation(360)
            return
        }
        setHitRotation(hitRotationRef.current - 1)
    });

    const hitPowerRef = useRef(hitPower);
    useEffect(() => {
        hitPowerRef.current = hitPower;
    }, [hitPower]);

    useHotkeys(['Up', 'w'], () => {
        // console.log("test", hitPowerRef.current)
        if (hitPowerRef.current >= 100) {
            return
        }
        setHitPower(hitPowerRef.current + 1)
    });
    useHotkeys(['Down', 's'], () => {
        // console.log("test", hitPowerRef.current)
        if (hitPowerRef.current <= 0) {
            return
        }
        setHitPower(hitPowerRef.current - 1)
    });

    useHotkeys(['Enter', 'space'], () => {

        console.log("Launch?")

        const socket = useSocketStore.getState().socket

        socket.emit('game:ice-slide:move', {
            hitRotation: hitRotationRef.current,
            hitPower: hitPowerRef.current
        });

        setLaunchPlayer(true)

    });

    return (
        <></>
    )

}