import {Edge, Node} from "reactflow";
import {SolverResult} from "@/tree_builder/domain/steps";

export default function solveEnumerateLeaves(nodes: Node[], edges: Edge[]): SolverResult {
    const terminals = nodes.filter(node => node.type === "terminal")
        .sort((nodeA, nodeB) => nodeA.position.x - nodeB.position.x);

    nodes = nodes.map(node => {
        if(node.type === "operator") {
            return node;
        }
        return {
            ...node,
            data: {
                ...node.data,
                terminalIndex: terminals.indexOf(node),
            }
        }
    })

    return {nodes, edges}
}
