import StepHelp from "@/tree_builder/presentation/StepHelp";
import {Button, Group, Kbd} from "@mantine/core";
import {useHotkeys} from "@mantine/hooks";
import finishNode from "@/tree_builder/domain/step5/finishNode";
import clearNode from "@/tree_builder/domain/step5/clearNode";
import useTree from "@/tree_builder/domain/useTree";

export default function LastReachedStatesHelper() {
    const nodes = useTree(state => state.nodes);
    const selected_nodes = nodes.filter(node => node.selected);
    const help = <StepHelp>
        The last reached read states set contains all ids of terminals in a subtree which may be the last to consume
        a character. While terminals can only read themselves last, ε-terminals must never be in this list, as they
        cannot read anything. ε-terminals always have an empty last reached list. Be aware that the first operand of
        a concatenation may also be the last reached if the second can read empty!
    </StepHelp>

    useHotkeys([
        ["Enter", () => finishNode(selected_nodes)],
        ["Escape", () => clearNode(selected_nodes, "lastReached")],
    ])

    if(selected_nodes.length === 0) {
        return <>
            Click node to select its last reached states
            {help}
        </>
    } else {
        return <>
            <Group>
                Click all terminals which can be reached last from the selected node. To clear node, press <Kbd py={2}>Esc</Kbd>,
                to finish node press <Kbd py={2}>Enter</Kbd> or
                <Button size={"xs"} h={28} onClick={() => finishNode(selected_nodes)}>Finish</Button>
            </Group>
            {help}
        </>
    }
}
