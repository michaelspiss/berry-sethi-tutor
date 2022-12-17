import {SolverResult} from "@/tree_builder/domain/steps";
import {Edge, Node} from "reactflow";
import setDataDfs from "@/tree_builder/domain/setDataDfs";

export default function solveCanBeEmpty(nodes: Node[], edges: Edge[]) : SolverResult {
    setDataDfs(nodes, edges, (node, children) => {
        switch (node.data.label) {
            case "ε":
            case "?":
            case "*":
                return {canBeEmpty: true};
            case "+":
            case "·":
                return {canBeEmpty: children[0].data.canBeEmpty}
            case "|":
                return {canBeEmpty: children.map(child => child.data.canBeEmpty).reduce((a,c) => !a && !c, false)}
            default:
                return {canBeEmpty: false};
        }
    });

    return {nodes, edges};
}

// TODO: add ε as button to regex input
