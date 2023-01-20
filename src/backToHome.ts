import useAppStateStore from "@/layout/stores/appStateStore";
import useTree from "@/tree_builder/domain/useTree";
import useAutomaton from "@/automaton_builder/domain/useAutomaton";

export default function backToHome() {
    useAppStateStore.setState({
        solveStep: -1,
        isSimplified: false,
        verificationErrors: undefined,
        disableSelect: false,
        isDone: false,
    })
    useTree.setState({
        nodes: [],
        edges: [],
    })
    useAutomaton.setState({
        states: "",
        finalStates: "",
        transitions: "",
    })
}
