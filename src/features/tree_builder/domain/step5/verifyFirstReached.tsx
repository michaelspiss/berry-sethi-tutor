import {VerificationError, VerificationResult} from "@/tree_builder/domain/steps";
import {Kbd} from "@mantine/core";
import {Edge, getOutgoers, Node} from "reactflow";
import arraysAreEqual from "@/tree_builder/domain/arraysAreEqual";

export default function verifyFirstReached(nodes: Node[], edges: Edge[]): VerificationResult {
    const errors: VerificationError[] = [];
    const step1edges = edges.filter(edge => edge.data.step === 0);
    const terminals = nodes.filter(node => step1edges.filter(edge => edge.source === node.id).length === 0)

    const terminalsMustReadThemselves: string[] = [];
    // epsilon is handled in separate case
    terminals.filter(node => node.data.label !== "ε").forEach(node => {
        if (node.data.firstReached.length === 1 && node.data.firstReached.includes(node.data.terminalIndex)) {
            return;
        }
        terminalsMustReadThemselves.push(node.id);
    })

    const epsilonMustHaveEmptyArray: string[] = [];
    terminals.filter(node => node.data.label === "ε").forEach(node => {
        if (node.data.firstReached.length === 0) {
            return;
        }
        epsilonMustHaveEmptyArray.push(node.id);
    })


    if (terminalsMustReadThemselves.length !== 0) {
        errors.push({
            title: "Terminals must only reach themselves first",
            message: <>Terminals always only reach themselves first, except for epsilon transitions, where the first reached
                is always empty. Try clearing all terminal first read lists and adding only themselves.</>,
            causes: terminalsMustReadThemselves,
        });
    }
    if (epsilonMustHaveEmptyArray.length !== 0) {
        errors.push({
            title: "Epsilon must read nothing first",
            message: <>As epsilon transitions don't have a subtree and don't read anything themselves, their first
                reached list must always be empty. Try selecting epsilon terminals which have elements in their first
                reached list and clearing them with <Kbd>Esc</Kbd></>,
            causes: epsilonMustHaveEmptyArray,
        })
    }

    const quantifiers = nodes.filter(node => ["*", "+", "?"].includes(node.data.label));
    const quantifiersHaveSameAttributeAsChild: string[] = [];
    quantifiers.forEach(quantifier => {
        const child = getOutgoers(quantifier, nodes, step1edges)[0]!;
        if (!arraysAreEqual(quantifier.data.firstReached, child.data.firstReached)) {
            quantifiersHaveSameAttributeAsChild.push(quantifier.id);
        }
    })

    if (quantifiersHaveSameAttributeAsChild.length !== 0) {
        errors.push({
            title: "Quantifiers must have same the same first read as their child",
            message: <>As quantifiers can only read their subtree, the first read attribute for them must always be the
                same as that of their direct child.</>,
            causes: quantifiersHaveSameAttributeAsChild,
        })
    }

    const concatenations = nodes.filter(node => node.data.label === "·");
    const concatenationsSecondIfFirstAlwaysEmpty: string[] = [];
    const concatenationsConcatIfFirstCanBeEmpty: string[] = [];
    const concatenationsFirstChildOnly: string[] = [];
    concatenations.forEach(concatenation => {
        const children = getOutgoers(concatenation, nodes, step1edges)
            .sort((nodeA, nodeB) => nodeA.position.x - nodeB.position.x);
        if(children[0].data.firstReached.length === 0) {
            if(!arraysAreEqual(concatenation.data.firstReached, children[1].data.firstReached)) {
                concatenationsSecondIfFirstAlwaysEmpty.push(concatenation.id);
            }
        } else if(children[0].data.canBeEmpty) {
            if(!arraysAreEqual(
                concatenation.data.firstReached,
                [...new Set(children[0].data.firstReached.concat(children[1].data.firstReached))],
            )) {
                concatenationsConcatIfFirstCanBeEmpty.push(concatenation.id);
            }
        } else {
            if(!arraysAreEqual(concatenation.data.firstReached, children[0].data.firstReached)) {
                concatenationsFirstChildOnly.push(concatenation.id);
            }
        }
    })

    if (concatenationsSecondIfFirstAlwaysEmpty.length !== 0) {
        errors.push({
            title: "Concatenation's first reached must equal second child if first is empty",
            message: <>If the first child cannot reach any read states, the first reached read states of the second
                child become the first reachable for the concatenation node.</>,
            causes: concatenationsSecondIfFirstAlwaysEmpty,
        })
    }

    if (concatenationsConcatIfFirstCanBeEmpty.length !== 0) {
        errors.push({
            title: "Concatenation's first reached must include items from both children if first can be empty",
            message: <>If the first child has the can be empty attribute set to true, the second child's first reached
                terminals may also be the concatenation's first reached. Thus, the concatenation's first reached read
                states must include all items of both children's first reached attributes.</>,
            causes: concatenationsConcatIfFirstCanBeEmpty,
        })
    }

    if (concatenationsFirstChildOnly.length !== 0) {
        errors.push({
            title: "Concatenation's first reached read states must equal that of the first child",
            message: <>As long as the first child's can be empty attribute is not set to true and the first child's
                first reached read states are not empty, a concatenation's first reached list equals that of its first
                child.</>,
            causes: concatenationsFirstChildOnly,
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
            message: <>As either child of an alteration may be the first one, all first reached states of the children
                need to be added to the alteration's.</>,
            causes: alterationsAlwaysBoth,
        })
    }

    // @ts-ignore
    return {nodes, edges, errors: errors.length === 0 ? undefined : errors}
}
