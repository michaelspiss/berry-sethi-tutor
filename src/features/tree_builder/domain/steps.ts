import validateSyntaxTree from "@/tree_builder/domain/validateSyntaxTree";
import {Edge, Node} from "reactflow";
import solveSyntaxTree from "@/tree_builder/domain/solveSyntaxTree";
import layOutSyntaxTree from "@/tree_builder/domain/layOutSyntaxTree";

interface StepDescription {
    title: string,
    validator: (nodes: Node[], edges: Edge[]) => ValidatorResult,
    solver: (nodes: Node[], edges: Edge[]) => SolverResult,
    /**
     * Called if either validator returns true or solver is run
     * @param nodes
     * @param edges
     */
    cleanup: (nodes: Node[], edges: Edge[]) => void,
    canMoveNodes: boolean,
    canEditNodes: boolean,
    canConnectNodes: boolean,
    canSourceConnectToSource: boolean,
}

export interface ValidatorResult {
    nodes: Node[],
    edges: Edge[],
    isValid: boolean,
}

export interface SolverResult {
    nodes: Node[],
    edges: Edge[],
}

function makeEdgesStaticCleanUp(edges: Edge[]) {
    edges.map((edge) => {
        edge.focusable = false;
        edge.interactionWidth = 0;
        edge.style = {pointerEvents: "none"};
        return edge
    });
}

// TODO: remove Partial<T> once data for every step exists
const steps: Partial<StepDescription>[] = [
    {
        // Step 1
        title: "Create syntax tree",
        validator: validateSyntaxTree,
        solver: solveSyntaxTree,
        cleanup: (nodes, edges) => {
            layOutSyntaxTree(nodes, edges);
            makeEdgesStaticCleanUp(edges);
        },
        canMoveNodes: true,
        canEditNodes: true,
        canConnectNodes: true,
        canSourceConnectToSource: false,
    }, {
        // Step 2
        title: "Draw possible steps",
        cleanup: (_, edges) => makeEdgesStaticCleanUp(edges),
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: true,
        canSourceConnectToSource: true,
    }, {
        // Step 3
        title: "Enumerate leaves",
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: false,
        canSourceConnectToSource: false,
    }, {
        // Step 4
        title: "Set empty attributes",
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: false,
        canSourceConnectToSource: false,
    }, {
        // Step 5
        title: "Collect may-set of first reached states",
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: false,
        canSourceConnectToSource: false,
    }, {
        // Step 6
        title: "Collect may-set of next reached read states per subtree",
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: false,
        canSourceConnectToSource: false,
    }, {
        // Step 7
        title: "Collect may-set of last reached read states per subtree",
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: false,
        canSourceConnectToSource: false,
    }, {
        // Step 8
        title: "Create automaton",
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: false,
        canSourceConnectToSource: false,
    }
]


export default steps
