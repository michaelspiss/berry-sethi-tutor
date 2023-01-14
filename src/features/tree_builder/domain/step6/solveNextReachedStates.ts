import {SolverResult} from "@/tree_builder/domain/steps";
import {Edge, Node} from "reactflow";

export default function solveNextReachedStates(nodes: Node[], edges: Edge[]): SolverResult {
    const pathEdges = edges.filter(edge => edge.data.step === 1);

    nodes = nodes.map(node => ({
        ...node,
        data: {
            ...node.data,
            nextReached: getNextReached(node, nodes, pathEdges),
        }
    }))

    return {nodes, edges}
}


/**
 * From node exit, traverse all paths and return reachable terminal indices
 * @param node
 * @param nodes
 * @param pathEdges
 */
export function getNextReached(node: Node, nodes: Node[], pathEdges: Edge[]): string[] {
    return pathEdges
        .filter(edge => edge.source === node.id && edge.sourceHandle === "step2r")
        .map(edge => traverseAndReturnNextReachedTerminals([], edge, nodes, pathEdges))
        .reduce((a, c) => a.concat(c), []);
}

function traverseAndReturnNextReachedTerminals(visitedHandles: string[], edge: Edge, nodes: Node[], pathEdges: Edge[]): string[] {
    const node = nodes.find(node => node.id === edge.target)!;
    if (node.type === "terminal") {
        return [node.data.terminalIndex]
    }

    if(visitedHandles.includes(node.id + "#" + edge.targetHandle)) {
        return [];
    }

    visitedHandles.push(node.id + "#" + edge.sourceHandle);

    return pathEdges
        .filter(pathEdge => pathEdge.source === edge.target && pathEdge.sourceHandle === edge.targetHandle)
        .map(followingEdge => traverseAndReturnNextReachedTerminals(visitedHandles, followingEdge, nodes, pathEdges))
        .reduce((a, c) => [...a, ...c], [])
}
