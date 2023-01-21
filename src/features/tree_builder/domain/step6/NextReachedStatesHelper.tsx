import StepHelp from "@/tree_builder/presentation/StepHelp";
import {Button, Group, Kbd} from "@mantine/core";
import {useHotkeys} from "@mantine/hooks";
import finishNode from "@/tree_builder/domain/step5/finishNode";
import clearNode from "@/tree_builder/domain/step5/clearNode";
import useTree from "@/tree_builder/domain/useTree";

export default function NextReachedStatesHelper() {
    const nodes = useTree(state => state.nodes)
    const selected_nodes = nodes.filter(node => node.selected);
    const help = <StepHelp>
        The next reached read states list contains all ids of terminals which may be the next to consume a character,
        after the current node. This can be achieved by starting at a node's exit handle and following all orange paths
        until a terminal is reached, while ignoring ε terminals. ε-terminals must never be in this list, as they do not
        consume any characters.
    </StepHelp>

    useHotkeys([
        ["Enter", () => finishNode(selected_nodes)],
        ["Escape", () => clearNode(selected_nodes, "nextReached")],
    ]);

    if(selected_nodes.length === 0) {
        return <>
            Click node to select its next reached states
            {help}
        </>
    } else {
        return <>
            <Group>
                Click all terminals which can be reached from the selected node's exit. To clear node, press <Kbd py={2}>Esc</Kbd>,
                to finish node press <Kbd py={2}>Enter</Kbd> or
                <Button size={"xs"} h={28} onClick={() => finishNode(selected_nodes)}>Finish</Button>
            </Group>
            {help}
        </>
    }
}
