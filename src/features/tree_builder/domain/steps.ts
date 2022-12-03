import validateSyntaxTree from "@/tree_builder/domain/validateSyntaxTree";
import {Edge, Node} from "reactflow";
import solveSyntaxTree from "@/tree_builder/domain/solveSyntaxTree";

interface StepDescription {
    validator: (nodes: Node[], edges: Edge[]) => ValidatorResult,
    solver: (nodes: Node[], edges: Edge[]) => SolverResult,
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

const steps: StepDescription[] = [
    {
        // Step 1: create syntax tree
        validator: validateSyntaxTree,
        solver: solveSyntaxTree,
        canMoveNodes: true,
        canEditNodes: true,
        canConnectNodes: true,
    }, {
        // Step 2: Draw possible steps
        validator: null,
        solver: null,
        canMoveNodes: false,
        canEditNodes: false,
        canConnectNodes: true,
    }
]


export default steps
