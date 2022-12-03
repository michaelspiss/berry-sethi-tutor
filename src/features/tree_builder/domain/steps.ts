import validateSyntaxTree from "@/tree_builder/domain/validateSyntaxTree";
import {Edge, Node} from "reactflow";
import solveSyntaxTree from "@/tree_builder/domain/solveSyntaxTree";

interface StepDescription {
    validator: (nodes: Node[], edges: Edge[]) => ValidatorResult,
    solver: (nodes: Node[], edges: Edge[]) => SolverResult,
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

const steps : StepDescription[] = [
    {
        // Step 1: create syntax tree
        validator: validateSyntaxTree,
        solver: solveSyntaxTree,
    }
]


export default steps
