import create from "zustand";

const useEnumerateLeaves = create<{
    nextIndex: number,
    getNextIndex: () => number
}>((set, get) => ({
    nextIndex: 0,
    getNextIndex: () => {
        const index = get().nextIndex;
        set({nextIndex: index + 1});
        return index;
    }
}))

export default useEnumerateLeaves
