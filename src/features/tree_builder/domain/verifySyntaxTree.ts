import {Edge, Node} from "reactflow";
import {VerificationResult} from "@/tree_builder/domain/steps";

function hasExactlyOneRoot(nodes: Node[], edges: Edge[], errors: VerificationResult['errors']) {

}

export default function verifySyntaxTree(nodes: Node[], edges: Edge[]): VerificationResult {
    const errors : VerificationResult['errors'] | [] = []

    return {
        nodes, edges, errors: errors.length === 0 ? undefined : errors,
    }
}
