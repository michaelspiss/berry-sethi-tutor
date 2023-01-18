import {VerificationError, VerificationResult} from "@/tree_builder/domain/steps";
import useTree from "@/tree_builder/domain/useTree";
import useAutomaton from "@/automaton_builder/domain/useAutomaton";
import {getIncomers} from "reactflow";

export default function verifyAutomaton(): VerificationResult {
    const errors: VerificationError[] = [];
    const nodes = useTree.getState().nodes;
    const edges = useTree.getState().edges;
    const terminals = nodes.filter(node => node.type === "terminal");
    const automatonState = useAutomaton.getState();
    const startState = "•r";

    // •r is never included in the checks, because it is added by default
    const userStates = automatonState.states.split(",").map(t => t.trim()).filter(t => t.length !== 0);
    const userIndices = userStates.map(s => s.replace(/•$/, ""));
    const correctIndices = terminals.filter(t => t.data.label !== "ε").map(t => t.data.terminalIndex.toString());
    const epsilonTransitionIndices = terminals.filter(t => t.data.label === "ε").map(t => t.data.terminalIndex.toString());

    const unknownIndices = userIndices.filter(i => !correctIndices.includes(i) && !epsilonTransitionIndices.includes(i));
    if (unknownIndices.length !== 0) {
        errors.push({
            title: "Unknown terminal index in state name",
            message: <>As per lecture definition, the state names must be the terminal's index succeeded by •,
                to describe the exit handle. The following are unknown terminal
                indices: <code>{unknownIndices.join(", ")}</code></>
        })

        // @ts-ignore
        return {nodes, edges, errors};
    }

    const notEndWithDot = userStates.filter(s => !s.endsWith("•") || (s.match(/•/g) ?? []).length !== 1)
    if (notEndWithDot.length !== 0) {
        errors.push({
            title: "States except the start state •r must use the exit handle",
            message: <>Because the consumption of a terminal leads to a new state, only the exit of a terminal node
                can be used as such.
                In the written notation, this is described via a • to the right of the terminal index for each state.
                A terminal "a" with index 0 would thus lead to a state named 0•<br/>
                The following states do not adhere to this rule: <code>{notEndWithDot.join(", ")}</code>
            </>
        })
    }

    const userStatesWithEpsilonTerminal = userIndices.filter(i => epsilonTransitionIndices.includes(i));
    if (userStatesWithEpsilonTerminal.length !== 0) {
        errors.push({
            title: "Epsilon transitions cannot be states",
            message: <>Since epsilon transitions don't consume, they don't lead to a new state.
                For this reason, indices of epsilon terminals cannot be in the states list.
                Try removing the violating states.
            </>
        })
    }

    if(errors.length === 0) {
        if(userStates.length !== correctIndices.length) {
            errors.push({
                title: "Missing state(s)",
                message: <>All indices of terminals except epsilon are separate states.
                Your states list is missing at least one.</>
            })
        }

        // @ts-ignore
        return {nodes, edges, errors};
    }

    if (errors.length === 0) {
        const correctStates = terminals.filter(t => t.data.label !== "ε").map(t => t.data.terminalIndex + "•");
        if (correctStates.length !== userStates.length || !userStates.map(s => correctStates.includes(s)).reduce((a, c) => a && c, true)) {
            errors.push({
                title: "States incorrect",
                message: <>At least one state violates the rules for creating states from the syntax tree.
                    All terminal exits in the syntax tree which are not epsilon are states.
                    The state names must be their respective terminal index (number).
                    The exit is described via a • to the right of the terminal index.
                    A terminal "a" with an index of 0 would thus lead to a state named 0•</>
            })
            // @ts-ignore
            return {nodes, edges, errors};
        }
    }

    const syntaxTreeEdges = edges.filter(edge => edge.data.step === 0);
    const rootNode = nodes.find(node => getIncomers(node, nodes, syntaxTreeEdges).length === 0)!;



    // @ts-ignore
    return {nodes, edges, errors: errors.length === 0 ? undefined : errors};
}
