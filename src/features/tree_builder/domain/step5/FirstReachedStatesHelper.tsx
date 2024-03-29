import StepHelp from "@/tree_builder/presentation/StepHelp";
import {Button, Group, Kbd} from "@mantine/core";
import {useHotkeys} from "@mantine/hooks";
import finishNode from "@/tree_builder/domain/step5/finishNode";
import clearNode from "@/tree_builder/domain/step5/clearNode";
import useTree from "@/tree_builder/domain/useTree";

export default function FirstReachedStatesHelper() {
    const nodes = useTree(state => state.nodes);
    const selected_nodes = nodes.filter(node => node.selected);
    const help = <StepHelp>
        The first reached read states set contains all ids of terminals in a subtree which may be the first to consume
        a character. While terminals can only read themselves first, ε-terminals must never be in this list, as they
        cannot read anything. ε-terminals always have an empty first reached list. Be aware that the second operand of
        a concatenation may also be the first reached if the first can read empty!
    </StepHelp>

    useHotkeys([
        ["Enter", () => finishNode(selected_nodes)],
        ["Escape", () => clearNode(selected_nodes, "firstReached")],
    ])

    if (selected_nodes.length === 0) {
        return <>
            Click node to select its first reached states
            {help}
        </>
    } else {
        return <>
            <Group>
                Click all terminals which can be reached first from the selected node. To clear node, press <Kbd py={2}>Esc</Kbd>,
                to finish node press <Kbd py={2}>Enter</Kbd> or
                <Button size={"xs"} h={28} onClick={() => finishNode(selected_nodes)}>Finish</Button>
            </Group>
            {help}
        </>
    }
}
