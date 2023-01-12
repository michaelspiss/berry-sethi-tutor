import create from "zustand";

const useAutomaton = create<{
    states: string,
    transitions: string,
    finalStates: string,
}>(() => ({
    states: "",
    transitions: "",
    finalStates: "",
}))

export default useAutomaton
