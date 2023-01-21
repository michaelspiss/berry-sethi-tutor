import {VerificationError, VerificationResult} from "@/tree_builder/domain/steps";
import useTree from "@/tree_builder/domain/useTree";
import useAutomaton from "@/automaton_builder/domain/useAutomaton";
import {getIncomers} from "reactflow";
import {transitionRegex} from "@/automaton_builder/presentation/AutomatonPreview";

type Transition = { id: string, source: string, terminal: string, target: string }

export default function verifyAutomaton(): VerificationResult {
    const errors: VerificationError[] = [];
    const nodes = useTree.getState().nodes;
    const edges = useTree.getState().edges;
    const terminals = nodes.filter(node => node.type === "terminal");
    const indices = terminals.map(t => t.data.terminalIndex.toString());
    const automatonState = useAutomaton.getState();
    const startState = "•r";

    // states list verification
    // •r is never included in the checks, because it is added by default
    const userStates = automatonState.states.split(",").map(t => t.trim()).filter(t => t.length !== 0);
    const userIndices = userStates.map(s => s.replace(/•$/, ""));
    const correctIndices = terminals.filter(t => t.data.label !== "ε").map(t => t.data.terminalIndex.toString()) as string[];
    const correctStates = [startState, ...correctIndices.map(i => i + "•")];
    const epsilonTransitionIndices = terminals.filter(t => t.data.label === "ε").map(t => t.data.terminalIndex.toString());

    const unknownIndices = userIndices.filter(i => !indices.includes(i));
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

    if (errors.length === 0) {
        if (userStates.length !== correctIndices.length) {
            errors.push({
                title: "Missing state(s)",
                message: <>All indices of terminals except epsilon are separate states.
                    Your states list is missing at least one.</>
            });

            // @ts-ignore
            return {nodes, edges, errors};
        }
    }

    if (errors.length === 0) {
        const correctStates = terminals.filter(t => t.data.label !== "ε").map(t => t.data.terminalIndex + "•");
        if (correctStates.length !== userStates.length || userStates.some(s => !correctStates.includes(s))) {
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

    // final states verification
    const syntaxTreeEdges = edges.filter(edge => edge.data.step === 0);
    const rootNode = nodes.find(node => getIncomers(node, nodes, syntaxTreeEdges).length === 0)!;

    const userFinalStates = automatonState.finalStates.split(",").map(t => t.trim()).filter(t => t.length !== 0);
    const correctFinalStates = (rootNode.data.lastReached as number[]).map(n => n.toString()).map(i => i + "•");
    if (rootNode.data.canBeEmpty) {
        correctFinalStates.push(startState);
    }

    const finalStateNotInStates = userFinalStates.filter(s => !correctStates.includes(s));
    if (finalStateNotInStates.length !== 0) {
        errors.push({
            title: "Final state not in states list",
            message: <>A state set as final is not defined in the states list. Check if the spelling matches, add the
                missing state(s), or remove the violating final
                state(s): <code>{finalStateNotInStates.join(", ")}</code></>
        })
    }

    const isRootMissing = rootNode.data.canBeEmpty ? !userFinalStates.includes(startState) : false;
    if (errors.length === 0) {
        const finalStateIsNotFinal = userFinalStates.filter(s => !correctFinalStates.includes(s));
        if (finalStateIsNotFinal.length !== 0) {
            errors.push({
                title: "State in final states list is not final",
                message: <>Only states which have their terminal index in the root node's last reached list and if the
                    root node can read empty, the start state, are final states. Try removing violating states from the
                    final states list: <code>{finalStateIsNotFinal.join(", ")}</code></>
            })
        }

        if (isRootMissing) {
            errors.push({
                title: "Root node is missing",
                message: <>Final states is missing {startState}. As the syntax tree's root node can read empty, no input
                    is valid input for the regular expression.</>
            })
        }
    }

    const correctFinalStatesMissing = correctFinalStates.filter(s => !userFinalStates.includes(s));
    if (correctFinalStatesMissing.length !== 0 && !(isRootMissing && correctFinalStatesMissing.length !== 1)) {
        if (errors.length === 0 || (isRootMissing && errors.length > 1)) {
            errors.push({
                title: "Final states are missing",
                message: <>All states which have their terminal index included in the root node's last visited list are
                    final states. If the root node can read empty, the start state {startState} is added as well.
                    Try adding the missing states.</>
            })
        }
    }

    if (errors.length !== 0) {
        // @ts-ignore
        return {nodes, edges, errors};
    }

    // transitions verification
    const validTerminals = terminals.map(t => t.data.label).filter(t => t !== "ε");

    const userTransitionsMatches = [...automatonState.transitions.matchAll(transitionRegex)];
    const uniqueUserTransitions = Object.values(userTransitionsMatches.map(match => ({
        id: `${match[1]}-${match[2]}-${match[3]}`,
        source: match[1],
        target: match[3],
        terminal: match[2],
    } as Transition)).reduce<{ [key: string]: Transition }>((a, c) => {
        a[c.id] = c;
        return a;
    }, {}))

    if (userTransitionsMatches.length > uniqueUserTransitions.length) {
        errors.push({
            title: "Duplicate transition",
            message: <>Your transitions list contains at least one duplicate. Try removing it/them.</>
        })
    }

    const invalidTerminals = [...new Set(uniqueUserTransitions.map(t => t.terminal).filter(t => !validTerminals.includes(t)))];
    if (invalidTerminals.length !== 0) {
        errors.push({
            title: "Unknown terminal in transition",
            message: <>At least one terminal consumed by a transition is not part of the
                alphabet: <code>{invalidTerminals.join(", ")}</code>. Try replacing them with valid input.</>
        })
    }

    const invalidTransitionStates = [...new Set([
        ...uniqueUserTransitions.map(t => t.source).filter(t => !correctStates.includes(t)),
        ...uniqueUserTransitions.map(t => t.target).filter(t => !correctStates.includes(t)),
    ])];
    if (invalidTransitionStates.length !== 0) {
        errors.push({
            title: "Unknown state in transition",
            message: <>At least one transition targets/originates from an unknown
                state: <code>{invalidTransitionStates.join(", ")}</code>. Try checking their spelling, or replacing
                them with valid states.</>
        })
    }

    if (errors.length !== 0) {
        // @ts-ignore
        return {nodes, edges, errors};
    }

    const transitionsWithWrongTerminal = uniqueUserTransitions.filter(t => {
        const targetIndex = t.target.replace(/•$/, "");
        const targetNode = terminals.find(terminal => terminal.data.terminalIndex.toString() === targetIndex)!;
        return t.terminal !== targetNode.data.label;
    });
    if(transitionsWithWrongTerminal.length !== 0) {
        errors.push({
            title: "Transition uses wrong terminal",
            message: <>Transitions always go to the exit handle of a terminal, consuming it in the process.
                At least one transition consumes a terminal, which does not match the terminal index defined in the
                target state.</>
        })
    }

    if (errors.length !== 0) {
        // @ts-ignore
        return {nodes, edges, errors};
    }

    const correctTransitions : string[] = [];
    const doesTransitionExist = (source: string, terminal: string, target: string) => {
        const id = `${source}-${terminal}-${target}`;
        correctTransitions.push(id);
        return uniqueUserTransitions.some(t => t.id === id);
    }

    const firstReachedTerminals = (rootNode.data.firstReached as number[]).map(n => terminals.find(t => t.data.terminalIndex === n)!);
    const missingTransitionsFromRoot = firstReachedTerminals.filter(t => !doesTransitionExist(startState, t.data.label, t.data.terminalIndex + "•"));
    if (missingTransitionsFromRoot.length !== 0) {
        errors.push({
            title: "Missing transition from start state",
            message: <>At least one transition originating from {startState} is missing.
                The root state must have transitions to all states listed in the root node's first reached list.</>
        })
    }

    const transitionOriginationTerminals = correctIndices.map(s => terminals.find(t => t.data.terminalIndex === parseInt(s))!);
    const missingTransitionsFromTerminal = transitionOriginationTerminals.flatMap(origination => {
        const nextReached = (origination.data.nextReached as number[]).map(n => terminals.find(t => t.data.terminalIndex === n)!);
        return nextReached.filter(n => !doesTransitionExist(origination.data.terminalIndex + "•", n.data.label, n.data.terminalIndex + "•"))
    })

    if (missingTransitionsFromTerminal.length !== 0) {
        errors.push({
            title: "Missing transition from terminal",
            message: <>At least one transition originating from a terminal is missing. Check all terminals and if a
                transition to their next read states exist.</>
        })
    }

    const wrongTransitions = uniqueUserTransitions.map(t => `${t.source}-${t.terminal}-${t.target}`).filter(t => !correctTransitions.includes(t));
    if(wrongTransitions.length !== 0) {
        errors.push({
            title: "Incorrect transition",
            message: <>At least one transition defines an incorrect state change. Valid transitions go from the start
                state {startState} to all its first reached and from all terminals which are not ε to their
                next reached.</>
        })
    }

    if (errors.length === 0) {
        if (automatonState.transitions.replaceAll(transitionRegex, "").replaceAll(/[,\n]/g, "").length !== 0) {
            errors.push({
                title: "Transitions input contains invalid data",
                message: <>Some input could not be recognized. Try removing everything that's not a comma or a
                    transition in the following format: <code>(state, terminal, state)</code></>
            })
        }
    }

    // @ts-ignore
    return {nodes, edges, errors: errors.length === 0 ? undefined : errors};
}
