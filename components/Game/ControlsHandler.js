"use client"
import { useEffect, useRef } from 'react';

import { useIceSlideStore } from '@/hooks/useIceSlideStore';
import { useHotkeys } from 'react-hotkeys-hook';

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

    useHotkeys(['Right'], () => {
        console.log("test", hitRotationRef.current)
        if (hitRotationRef.current >= 360) {
            setHitRotation(0)
            return
        }
        setHitRotation(hitRotationRef.current + 1)
    });
    useHotkeys(['Left'], () => {
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

    useHotkeys(['Up'], () => {
        // console.log("test", hitPowerRef.current)
        if (hitPowerRef.current >= 100) {
            return
        }
        setHitPower(hitPowerRef.current + 1)
    });
    useHotkeys(['Down'], () => {
        // console.log("test", hitPowerRef.current)
        if (hitPowerRef.current <= 0) {
            return
        }
        setHitPower(hitPowerRef.current - 1)
    });

    useHotkeys(['Enter'], () => {
        console.log("Launch?")
        setLaunchPlayer(true)
    });

    return (
        <></>
    )

}