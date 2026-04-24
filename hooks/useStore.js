import generateRandomNickname from '@/util/generateRandomNickname';
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useStore = create()(
  persist(
    (set, get) => ({

      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      },

      nickname: generateRandomNickname(),
      setNickname: (newValue) => {
        set((prev) => ({
          nickname: newValue
        }))
      },
      randomNickname: () => {

        const newNickname = generateRandomNickname();

        set((prev) => ({
          nickname: newNickname
        }))
      },

      // character: {
      //   model: 'Clownfish',
      //   color: '#d87e07'
      // },
      // setCharacter: (newValue) => {
      //   set((prev) => ({
      //     character: newValue
      //   }))
      // },
      // characters: [
      //   {
      //     name: "Clownfish",
      //     image: `${process.env.NEXT_PUBLIC_CDN}${assets_src}ClownfishModelThumb.jpg`,
      //     model:
      //       (
      //         <group>
      //           <ClownfishModel />
      //         </group>
      //       ),
      //     defaultColor: '#FFFFFF',
      //   },
      //   {
      //     name: "Bone Fish",
      //     image: `${process.env.NEXT_PUBLIC_CDN}${assets_src}BoneFishModelThumb.jpg`,
      //     model:
      //       (
      //         <group>
      //           <BoneFishModel />
      //         </group>
      //       ),
      //     defaultColor: '',
      //   }
      // ],

      darkMode: null,
      setDarkMode: (newValue) => {
        set((prev) => ({
          darkMode: newValue
        }))
      },
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),

      updateCamera: null,
      setUpdateCamera: (updateCamera) => set({ updateCamera }),

      threeDimensional: true, // 'Light' | 'Dark' | null
      setThreeDimensional: (threeDimensional) => set({ threeDimensional }),

      showMenu: false,
      setShowMenu: (value) => set({ showMenu: value }),
      toggleShowMenu: () => set({ showMenu: !get().showMenu }),

      sidebar: true,
      setSidebar: (value) => set({ sidebar: value }),
      toggleSidebar: () => set({ sidebar: !get().sidebar }),

      landingAnimation: true,
      setLandingAnimation: (value) => set({ landingAnimation: value }),
      toggleLandingAnimation: () => set({ landingAnimation: !get().landingAnimation }),

      showInfoModal: false,
      setShowInfoModal: (value) => set({ showInfoModal: value }),
      toggleInfoModal: () => set({ showInfoModal: !get().showInfoModal }),

      loginInfoModal: false,
      setLoginInfoModal: (value) => set({ loginInfoModal: value }),
      toggleLoginInfoModal: () => set({ loginInfoModal: !get().loginInfoModal }),

      showSettingsModal: false,
      setShowSettingsModal: (value) => set({ showSettingsModal: value }),
      toggleSettingsModal: () => set({ showSettingsModal: !get().showSettingsModal }),

      showCreditsModal: false,
      setShowCreditsModal: (value) => set({ showCreditsModal: value }),
      toggleCreditsModal: () => set({ showCreditsModal: !get().showCreditsModal }),

      graphicsQuality: "High",
      setGraphicsQuality: (value) => set({ graphicsQuality: value }),

      lobbyDetails: {
        players: [],
        games: [],
      },
      setLobbyDetails: (lobbyDetails) => set({ lobbyDetails }),

      debug: false,
      setDebug: (newValue) => {
        set((prev) => ({
          debug: newValue
        }))
      },

      sceneKey: 0,
      incSceneKey: () => set((prev) => ({
        sceneKey: prev.sceneKey + 1
      })),

    }),
    {
      name: 'ice-slide-store',
      version: 1,
      partialize: (state) => ({
        nickname: state.nickname,
        character: state.character,
        darkMode: state.darkMode,
        graphicsQuality: state.graphicsQuality,
        landingAnimation: state.landingAnimation,
        sidebar: state.sidebar,
        graphicsQuality: state.graphicsQuality,
        debug: state.debug
      }),
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true)
      },
    },
  ),
)