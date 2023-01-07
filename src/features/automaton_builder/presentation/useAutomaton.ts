import create from "zustand";

const useAutomaton = create<{
    definition: string,
}>(() => ({
    definition: "",
}))

export default useAutomaton
