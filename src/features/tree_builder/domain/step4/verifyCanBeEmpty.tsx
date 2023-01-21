import {Edge, Node} from "reactflow";
import {VerificationError, VerificationResult} from "@/tree_builder/domain/steps";
import setDataDfs from "@/tree_builder/domain/setDataDfs";

export default function verifyCanBeEmpty(nodes: Node[], edges: Edge[]): VerificationResult {
    const epsilonNotEmpty: string[] = [];
    const emptyOperatorNotEmpty: string[] = [];
    const operatorEmptyUnequalChild: string[] = [];
    const concatReadsEmptyWithNonEmptyChild: string[] = [];
    const concatDoesNotReadEmptyWithEmptyChild: string[] = [];
    const altReadsEmptyWithoutEmptyChild: string[] = [];
    const altDoesNotReadEmptyWithEmptyChild: string[] = [];
    const terminalReadsEmpty: string[] = [];

    setDataDfs(nodes, edges, (node, children) => {
        switch (node.data.label) {
            case "ε":
                !node.data.canBeEmpty ? epsilonNotEmpty.push(node.id) : null;
                break;
            case "?":
            case "*":
                !node.data.canBeEmpty ? emptyOperatorNotEmpty.push(node.id) : null;
                break;
            case "+":
                node.data.canBeEmpty !== children[0].data.canBeEmpty
                    ? operatorEmptyUnequalChild.push(node.id) : null;
                break;
            case "·":
                const allEmpty = children.map(child => child.data.canBeEmpty).reduce((a, c) => a && c, true);
                node.data.canBeEmpty && !allEmpty ? concatReadsEmptyWithNonEmptyChild.push(node.id) : null;
                !node.data.canBeEmpty && allEmpty ? concatDoesNotReadEmptyWithEmptyChild.push(node.id) : null;
                break;
            case "|":
                const hasEmpty = children.some(child => child.data.canBeEmpty);
                node.data.canBeEmpty && !hasEmpty ? altReadsEmptyWithoutEmptyChild.push(node.id) : null;
                !node.data.canBeEmpty && hasEmpty ? altDoesNotReadEmptyWithEmptyChild.push(node.id) : null;
                break;
            default:
                node.data.canBeEmpty ? terminalReadsEmpty.push(node.id) : null;
        }
        return {};
    })

    const errors: VerificationError[] = [];
    if (epsilonNotEmpty.length !== 0) {
        errors.push({
            title: "Reading epsilon does not read empty",
            message: <>At least one ε (epsilon) terminal does not read empty. ε means "read nothing" is thus always
                reads empty. Try setting all ε terminal "can read empty" attributes to true</>,
            causes: epsilonNotEmpty,
        })
    }
    if (emptyOperatorNotEmpty.length !== 0) {
        errors.push({
            title: "? and/or * does not read empty",
            message: <>"Zero or more" (*) and "zero or one" (?) operators can always read empty, but at least one is
                set to "cannot read empty".</>,
            causes: emptyOperatorNotEmpty,
        })
    }
    if (operatorEmptyUnequalChild.length !== 0) {
        errors.push({
            title: "+ does not have the same value as its child",
            message: <>At least one "can read empty" value is different from its child. "One or more" (+) can only repeat
                its child and thus can only be empty if the child can be.</>,
            causes: operatorEmptyUnequalChild,
        })
    }
    if (concatReadsEmptyWithNonEmptyChild.length !== 0) {
        errors.push({
            title: "Concatenation reads empty with at least non empty child",
            message: <>Concatenations can read empty if all children can read empty, but at least one child cannot.</>,
            causes: concatReadsEmptyWithNonEmptyChild,
        })
    }
    if (concatDoesNotReadEmptyWithEmptyChild.length !== 0) {
        errors.push({
            title: "Concatenation does not read empty even though all children can read empty",
            message: <>Concatenations can read empty if all their children read empty, but at least one concatenation
                where this applies is set to "does not read empty".</>,
            causes: concatDoesNotReadEmptyWithEmptyChild,
        })
    }
    if (altReadsEmptyWithoutEmptyChild.length !== 0) {
        errors.push({
            title: "Alteration reads empty without an empty child",
            message: <>Alterations can read empty if at least one of their children can read empty. At least one alteration
                is set to "can read empty", even though none of its children can.</>,
            causes: altReadsEmptyWithoutEmptyChild,
        })
    }
    if (altDoesNotReadEmptyWithEmptyChild.length !== 0) {
        errors.push({
            title: "Alteration does not read empty with an empty child",
            message: <>Alterations can read empty if at least one of their children can read empty. At least one alteration
                is set to "can not read empty", even though one of their children can.</>,
            causes: altDoesNotReadEmptyWithEmptyChild,
        })
    }
    if(terminalReadsEmpty.length !== 0) {
        errors.push({
            title: "Terminal which is not epsilon reads empty",
            message: <>Epsilon (ε) is the only terminal which reads empty. Try setting all other terminals to "can not be empty".</>,
            causes: terminalReadsEmpty,
        })
    }

    // @ts-ignore
    return {nodes, edges, errors: errors.length === 0 ? undefined : errors};
}
