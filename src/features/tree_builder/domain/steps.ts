import validateSyntaxTree from "@/tree_builder/domain/validateSyntaxTree";
import {Edge, Node} from "reactflow";
import solveSyntaxTree from "@/tree_builder/domain/solveSyntaxTree";

interface StepDescription {
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
        return edge
    });
}

const steps: StepDescription[] = [
    {
        // Step 1: create syntax tree
        validator: validateSyntaxTree,
        solver: solveSyntaxTree,
        cleanup: (_, edges) => makeEdgesStaticCleanUp(edges),
        canMoveNodes: true,
        canEditNodes: true,
        canConnectNodes: true,
    }, {
        // Step 2: Draw possible steps
        validator: null,
        solver: null,
        cleanup: (_, edges) => makeEdgesStaticCleanUp(edges),
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: true,
    }
]


export default steps
