import StepHelp from "@/tree_builder/presentation/StepHelp";
import {Kbd} from "@mantine/core";

export default function CreateAutomatonHelper() {
    return <>
        <span>Provide the formal definition of the automaton from the syntax tree using the lecture's rules. Enter
            regular dot <Kbd>.</Kbd> for •</span>
        <StepHelp>
            <b>States:</b> start state •r and the ids of all terminals which are not ε.<br/>
            <b>Start state:</b> •r<br/>
            <b>Final states:</b> states from the last reached list of the syntax tree's root node and the start state •r if the
            root node can read empty<br/>
            <b>Transitions:</b> from start state •r to all off the syntax tree's root's first reached and from all terminals
            which are states to all their next reached
        </StepHelp>
    </>
}
