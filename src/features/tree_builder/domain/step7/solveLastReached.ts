import {SolverResult} from "@/tree_builder/domain/steps";
import {Edge, Node} from "reactflow";
import setDataDfs from "@/tree_builder/domain/setDataDfs";

export default function solveLastReached(nodes: Node[], edges: Edge[]) : SolverResult {
    setDataDfs(nodes, edges, (node, children) => {
        switch (node.data.label) {
            case "ε":
                return {lastReached: []}
            case "·":
            case "|":
                if(children[1].data.canBeEmpty || node.data.label === "|") {
                    return {lastReached: children[0].data.lastReached.concat(children[1].data.lastReached)}
                }
                return {lastReached: children[1].data.lastReached}
            case "*":
            case "+":
            case "?":
                return {lastReached: children[0].data.lastReached}
            default:
                return {lastReached: [node.data.terminalIndex]}
        }
    })
    return {nodes, edges}
}
