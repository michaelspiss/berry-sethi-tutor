import {Edge, Node} from "reactflow";
import {ValidatorResult} from "@/tree_builder/domain/steps";

function onlyOneRoot(nodes: Node[], edges: Edge[]) {

}

export default function validateSyntaxTree(nodes: Node[], edges: Edge[]): ValidatorResult {
    return {
        nodes, edges, isValid: false,
    }
}
