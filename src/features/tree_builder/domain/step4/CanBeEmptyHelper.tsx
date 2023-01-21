import StepHelp from "@/tree_builder/presentation/StepHelp";

export default function CanBeEmptyHelper() {
    return <>
        Click nodes to toggle their "can read empty" attribute
        <StepHelp>
            Nodes can read empty if they can skip their subtree, read only empty from a child, or if they can read the
            terminal ε. An alteration may for example read empty if one of their children can read empty.
        </StepHelp>
    </>
}
