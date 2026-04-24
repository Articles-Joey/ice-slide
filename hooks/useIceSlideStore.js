"use client"
// import { create } from 'zustand'
import { createWithEqualityFn as create } from 'zustand/traditional'
import { persist } from 'zustand/middleware'
// import { nanoid } from 'nanoid'

// const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key))
// const setLocalStorage = (key, value) => window.localStorage.setItem(key, JSON.stringify(value))

// export const useIceSlideStore = create((set) => ({
export const useIceSlideStore = create((set) => ({

    players: [],
    setPlayers: (newValue) => {
        set((prev) => ({
            players: newValue
        }))
    },
    launchPlayers: false,
    setLaunchPlayers: (newValue) => {
        set((prev) => ({
            launchPlayers: newValue
        }))
    },

    launchPlayer: false,
    setLaunchPlayer: (newValue) => {
        set((prev) => ({
            launchPlayer: newValue
        }))
    },

    // Mouse and Keyboard
    // Touch
    controlType: "Mouse and Keyboard",
    setControlType: (newValue) => {
        set((prev) => ({
            controlType: newValue
        }))
    },

    music: false,
    setMusic: (newValue) => {
        set((prev) => ({
            music: newValue
        }))
    },

    hitRotation: 0,
    setHitRotation: (newValue) => {
        set((prev) => ({
            hitRotation: newValue
        }))
    },

    hitPower: 0,
    setHitPower: (newValue) => {
        set((prev) => ({
            hitPower: newValue
        }))
    },

}))