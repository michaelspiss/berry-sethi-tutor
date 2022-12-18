import {SolverResult} from "@/tree_builder/domain/steps";
import {Edge, Node} from "reactflow";
import setDataDfs from "@/tree_builder/domain/setDataDfs";

export default function solveFirstReachedStates(nodes: Node[], edges: Edge[]) : SolverResult {
    setDataDfs(nodes, edges, (node, children) => {
        switch(node.data.label) {
            case "ε":
                return {firstReached: []}
            case "·":
            case "|":
                if(children[0].data.canBeEmpty || node.data.label === "|") {
                    return {firstReached: children[0].data.firstReached.concat(children[1].data.firstReached)}
                }
                return {firstReached: children[0].data.firstReached}
            case "*":
            case "+":
            case "?":
                return {firstReached: children[0].data.firstReached}
            default:
                return {firstReached: [node.data.terminalIndex]}
        }
    })
    return {nodes, edges}
}
