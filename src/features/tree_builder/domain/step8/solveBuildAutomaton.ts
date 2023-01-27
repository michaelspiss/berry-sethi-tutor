import {SolverResult} from "@/tree_builder/domain/steps";
import {Edge, Node} from "reactflow";
import useAutomaton from "@/automaton_builder/domain/useAutomaton";

export default function solveBuildAutomaton(nodes: Node[], edges: Edge[]) : SolverResult {
    const terminals = nodes.filter(node => node.type === "terminal").filter(t => t.data.label !== "ε");
    const syntaxTreeEdges = edges.filter(edge => edge.data.step === 0);
    const root = nodes.find(node => !syntaxTreeEdges.some(edge => edge.target === node.id))!;

    // •r is added by default
    const states = terminals.map(t => t.data.terminalIndex + "•");

    const rootLastReached = (root.data.lastReached as string[]).map(t => t + "•");
    const finalStates = root.data.canBeEmpty ? ["•r"].concat(rootLastReached) : rootLastReached;

    const rootTransitions = (root.data.firstReached as string[]).map(t => {
        let terminal = terminals.find(terminal => terminal.data.terminalIndex === t)?.data.label ?? "";
        terminal = terminal.startsWith("\\") ? terminal.substring(1) : terminal;
        return `(•r, ${terminal}, ${t}•)`
    })

    const terminalTransitions = terminals.flatMap(terminal => (terminal.data.nextReached as string[]).map(next => {
        let nextTerminal = terminals.find(n => n.data.terminalIndex === next)?.data.label ?? "";
        nextTerminal = nextTerminal.startsWith("\\") ? nextTerminal.substring(1) : nextTerminal;
        return `(${terminal.data.terminalIndex}•, ${nextTerminal}, ${next}•)`
    }))

    const transitions = [...new Set([...rootTransitions, ...terminalTransitions])];

    useAutomaton.setState({
        states: states.join(", "),
        finalStates: finalStates.join(", "),
        transitions: transitions.join(",\n"),
    })

    return {nodes, edges};
}
