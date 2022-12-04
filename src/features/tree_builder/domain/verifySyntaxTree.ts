import {Edge, Node} from "reactflow";
import {VerificationResult} from "@/tree_builder/domain/steps";

function hasExactlyOneRoot(nodes: Node[], edges: Edge[], errors: string[]) {

}

export default function verifySyntaxTree(nodes: Node[], edges: Edge[]): VerificationResult {
    return {
        nodes, edges, errors: [],
    }
}
