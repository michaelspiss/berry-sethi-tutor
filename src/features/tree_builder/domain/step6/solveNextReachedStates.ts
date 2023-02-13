import {SolverResult} from "@/tree_builder/domain/steps";
import {Edge, getIncomers, getOutgoers, Node} from "reactflow";

export default function solveNextReachedStates(nodes: Node[], edges: Edge[]): SolverResult {
    const syntaxTreeEdges = edges.filter(edge => edge.data.step === 0);
    const rootNode = nodes.find(node => getIncomers(node, nodes, syntaxTreeEdges).length === 0)!;
    rootNode.data.nextReached = [];

    getNextReachedRec(rootNode, nodes, syntaxTreeEdges);

    // refresh
    nodes = nodes.map(node => ({
        ...node,
        data: {
            ...node.data,
        }
    }))

    return {nodes, edges}
}

/**
 * DFS pre-order traversal for setting the next attribute. Does not set root to []
 * @param parent
 * @param nodes
 * @param syntaxTreeEdges
 */
export function getNextReachedRec(parent: Node, nodes: Node[], syntaxTreeEdges: Edge[]) {
    const children = getOutgoers(parent, nodes, syntaxTreeEdges).sort((nodeA, nodeB) => nodeA.position.x - nodeB.position.x);
    if(children.length === 0) {
        return;
    }

    switch (parent.data.label) {
        case "·":
            if(children[1].data.canBeEmpty) {
                children[0].data.nextReached = [...new Set([...children[1].data.firstReached, ...parent.data.nextReached])];
            } else {
                children[0].data.nextReached = children[1].data.firstReached;
            }
            children[1].data.nextReached = parent.data.nextReached;
            break;
        case "|":
            children[0].data.nextReached = parent.data.nextReached;
            children[1].data.nextReached = parent.data.nextReached;
            break;
        case "*":
        case "+":
            children[0].data.nextReached = [...new Set([...children[0].data.firstReached, ...parent.data.nextReached])]
            break;
        case "?":
            children[0].data.nextReached = parent.data.nextReached;
            break;
    }

    children.forEach(child => getNextReachedRec(child, nodes, syntaxTreeEdges))
}
