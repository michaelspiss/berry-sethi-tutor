import StepHelp from "@/tree_builder/presentation/StepHelp";
import {Group, Kbd} from "@mantine/core";
import {useHotkeys} from "@mantine/hooks";
import useEnumerateLeaves from "@/tree_builder/domain/step3/useEnumerateLeaves";
import useTree from "@/tree_builder/domain/useTree";

export default function EnumerateLeavesHelper() {
    useHotkeys([["Escape", () => {
        useTree.getState().setNodes(nodes => nodes.map(node => {
            return node.type === "terminal" ? {
                ...node,
                data: {
                    ...node.data,
                    terminalIndex: undefined,
                }
            } : node;
        }))
        useEnumerateLeaves.setState({nextIndex: 0});
    }]])

    return <>
        <Group>
            Select terminals in the order they appear in the regular expression. Press <Kbd py={2}>Esc</Kbd> to restart
        </Group>
        <StepHelp>
            As multiple terminals may be the same, each gets a unique identifier. This is, as per lecture convention,
            their 0-indexed position. Due to the syntax tree's nature, the order of the leafs left-to-right is the
            same as in the original regular expression.
        </StepHelp>
    </>
}
