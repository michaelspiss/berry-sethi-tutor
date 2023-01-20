import {Edge, Node} from "reactflow";
import {VerificationError, VerificationResult} from "@/tree_builder/domain/steps";
import {getNextReached} from "@/tree_builder/domain/step6/solveNextReachedStates";

export default function verifyNextReached(nodes: Node[], edges: Edge[]): VerificationResult {
    const pathEdges = edges.filter(edge => edge.data.step === 1);
    const errors: VerificationError[] = [];

    const notEnoughTerminals: string[] = [];
    const tooManyTerminals: string[] = [];
    const lastDontReadEmpty: string[] = [];
    const terminalReadsItselfWithoutLoopBack: string[] = [];
    const nextReachedContainsEpsilon : Set<string> = new Set();

    const epsilonTerminalIndices = nodes.filter(n => n.type === "terminal" && n.data.label === "ε")
        .map(t => t.data.terminalIndex) as number[];

    nodes.forEach(node => {
        const reachableNodes = getNextReached(node, nodes, pathEdges);
        if (reachableNodes.length === 0 && node.data.nextReached.length !== 0) {
            lastDontReadEmpty.push(node.id);
            return;
        }
        reachableNodes.forEach(reachableNode => {
            if (!node.data.nextReached.includes(reachableNode)) {
                notEnoughTerminals.push(node.id);
            }
        })
        node.data.nextReached.forEach((userNextReached: string) => {
            if (!reachableNodes.includes(userNextReached)) {
                tooManyTerminals.push(node.id);
            }
        })
        epsilonTerminalIndices.forEach(e => {
            if(node.data.nextReached.includes(e)) {
                nextReachedContainsEpsilon.add(node.id);
            }
        })
        if (node.type === "terminal"
            && node.data.nextReached.includes(node.data.terminalIndex)
            && !reachableNodes.includes(node.data.terminalIndex)
        ) {
            terminalReadsItselfWithoutLoopBack.push(node.id);
        }
    })

    if (notEnoughTerminals.length !== 0) {
        errors.push({
            title: 'Terminals are missing',
            message: <>Nodes can reach more terminals than selected. Try walking all possible paths from each node's
                exit until they reach a terminal.</>,
            causes: notEnoughTerminals,
        })
    }

    if (tooManyTerminals.length !== 0) {
        errors.push({
            title: 'Unreachable terminals are added',
            message: <>At least one node's next reached list contains a terminal which cannot be reached by that node.
                Try checking the paths of each node. The paths to check start at the node's exit handle and follow the
                direction of the arrows.</>,
            causes: tooManyTerminals,
        })
    }

    if(lastDontReadEmpty.length !== 0 && nextReachedContainsEpsilon.size === 0) {
        errors.push({
            title: 'Nodes have next reached even though they cannot reach anything',
            message: <>Some nodes cannot reach any terminals from their exit point.
                These should have an empty next reached list. Try looking especially at the nodes on
                the far right of the graph.</>,
            causes: lastDontReadEmpty,
        })
    }

    if(nextReachedContainsEpsilon.size !== 0) {
        errors.push({
            title: "Next reached contains epsilon terminal",
            message: <>Epsilon terminals do not read anything and can thus never be a next reached read state.
                Try removing all indices of epsilon terminals from the lists.</>,
            causes: [...nextReachedContainsEpsilon],
        })
    }

    if(terminalReadsItselfWithoutLoopBack.length !== 0) {
        errors.push({
            title: 'Terminal reads itself without a loop back',
            message: <>As the "next reached" paths start at the exit handle of a node, terminals cannot read themselves
                unless there is a loop back to it somewhere in the path. For at least one terminal, this is not the
                case. Try checking all terminals whether they can read themselves.</>,
            causes: terminalReadsItselfWithoutLoopBack,
        })
    }

    // @ts-ignore
    return {nodes, edges, errors: errors.length === 0 ? undefined : errors}
}
