import {VerificationError, VerificationResult} from "@/tree_builder/domain/steps";
import {Edge, Node} from "reactflow";
import {getOutgoers} from "../../../../../../react-flow/packages/reactflow";
import arraysAreEqual from "@/tree_builder/domain/arraysAreEqual";
import {Kbd} from "@mantine/core";

export default function verifyLastReached(nodes: Node[], edges: Edge[]) : VerificationResult {
    const errors: VerificationError[] = [];
    const step1edges = edges.filter(edge => edge.data.step === 0);
    const terminals = nodes.filter(node => step1edges.filter(edge => edge.source === node.id).length === 0)

    const terminalsMustReadThemselves: string[] = [];
    // epsilon is handled in separate case
    terminals.filter(node => node.data.label !== "ε").forEach(node => {
        if (node.data.lastReached.length === 1 && node.data.lastReached.includes(node.data.terminalIndex)) {
            return;
        }
        terminalsMustReadThemselves.push(node.id);
    })
    if (terminalsMustReadThemselves.length !== 0) {
        errors.push({
            title: "Terminals must only reach themselves last",
            message: <>Terminals always only reach themselves last, except for epsilon transitions, where the last reached
                list is always empty. Try clearing the last reached lists of all terminals and adding only themselves.</>,
            causes: terminalsMustReadThemselves,
        });
    }

    const epsilonMustHaveEmptyArray: string[] = [];
    terminals.filter(node => node.data.label === "ε").forEach(node => {
        if (node.data.lastReached.length === 0) {
            return;
        }
        epsilonMustHaveEmptyArray.push(node.id);
    })

    if (epsilonMustHaveEmptyArray.length !== 0) {
        errors.push({
            title: "Epsilon must reach nothing last",
            message: <>As epsilon transitions don't have a subtree and don't read anything themselves, their last
                reached list must always be empty. Try selecting epsilon terminals which have elements in their last
                reached list and clearing them with <Kbd>Esc</Kbd></>,
            causes: epsilonMustHaveEmptyArray,
        })
    }

    const quantifiers = nodes.filter(node => ["*", "+", "?"].includes(node.data.label));
    const quantifiersHaveSameAttributeAsChild: string[] = [];
    quantifiers.forEach(quantifier => {
        const child = getOutgoers(quantifier, nodes, step1edges)[0]!;
        if (!arraysAreEqual(quantifier.data.lastReached, child.data.lastReached)) {
            quantifiersHaveSameAttributeAsChild.push(quantifier.id);
        }
    })

    if (quantifiersHaveSameAttributeAsChild.length !== 0) {
        errors.push({
            title: "Quantifiers must have same the same last reached as their child",
            message: <>As quantifiers can only read their subtree, the last reached attribute for them must always be the
                same as that of their direct child.</>,
            causes: quantifiersHaveSameAttributeAsChild,
        })
    }

    // from here
    const concatenations = nodes.filter(node => node.data.label === "·");
    const concatenationsFirstIfSecondAlwaysEmpty: string[] = [];
    const concatenationsConcatIfSecondCanBeEmpty: string[] = [];
    const concatenationsSecondChildOnly: string[] = [];
    concatenations.forEach(concatenation => {
        const children = getOutgoers(concatenation, nodes, step1edges)
            .sort((nodeA, nodeB) => nodeA.position.x - nodeB.position.x);
        if (children[1].data.lastReached.length === 0
            && !arraysAreEqual(concatenation.data.lastReached, children[0].data.lastReached)) {
            concatenationsFirstIfSecondAlwaysEmpty.push(concatenation.id);
        } else if (children[1].data.canBeEmpty
            && !arraysAreEqual(
                concatenation.data.lastReached,
                [...new Set(children[0].data.lastReached.concat(children[1].data.lastReached))],
            )) {
            concatenationsConcatIfSecondCanBeEmpty.push(concatenation.id);
        } else if (!arraysAreEqual(concatenation.data.lastReached, children[1].data.lastReached)) {
            concatenationsSecondChildOnly.push(concatenation.id);
        }
    })

    if (concatenationsFirstIfSecondAlwaysEmpty.length !== 0) {
        errors.push({
            title: "Concatenation's last reached must equal first child if second is empty",
            message: <>If the second child cannot reach any read states, the last reached read states of the first
                child become the last reachable for the concatenation node.</>,
            causes: concatenationsFirstIfSecondAlwaysEmpty,
        })
    }

    if (concatenationsConcatIfSecondCanBeEmpty.length !== 0) {
        errors.push({
            title: "Concatenation's last reached must include items from both children if second can be empty",
            message: <>If the second child has the can be empty attribute set to true, the first child's last reached
                terminals may also be the concatenation's last reached. Thus, the concatenation's last reached read
                states must include all items of both children's last reached attributes.</>,
            causes: concatenationsConcatIfSecondCanBeEmpty,
        })
    }

    if (concatenationsSecondChildOnly.length !== 0) {
        errors.push({
            title: "Concatenation's last reached read states must equal that of the second child",
            message: <>As long as the second child's can be empty attribute is not set to true and the second child's
                last reached read states are not empty, a concatenation's last reached list equals that of its second
                child.</>,
            causes: concatenationsSecondChildOnly,
        })
    }

    const alterations = nodes.filter(node => node.data.label === "|");
    const alterationsAlwaysBoth: string[] = [];
    alterations.forEach(alteration => {
        const children = getOutgoers(alteration, nodes, step1edges);
        const childrenFirstReached = [...new Set(children[0].data.firstReached.concat(children[1].data.firstReached))];
        if (!arraysAreEqual(alteration.data.firstReached, childrenFirstReached)) {
            alterationsAlwaysBoth.push(alteration.id);
        }
    })

    if (alterationsAlwaysBoth.length !== 0) {
        errors.push({
            title: "Alterations must always include all items from both children",
            message: <>As either child of an alteration may be the last one, all last reached states of the children
                need to be added to the alteration's.</>,
            causes: alterationsAlwaysBoth,
        })
    }

    // @ts-ignore
    return {nodes, edges, errors: errors.length === 0 ? undefined : errors}
}
