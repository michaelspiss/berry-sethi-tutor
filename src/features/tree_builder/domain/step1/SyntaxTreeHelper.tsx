import StepHelp from "@/tree_builder/presentation/StepHelp";
import RegexHighlighter from "@/analyze_regex/presentation/RegexHighlighter";

export default function SyntaxTreeHelper() {
    return <>
        Drag nodes from the bottom toolbar to build the syntax tree.
        <StepHelp>
            The syntax tree is a representation of the original regular expression as data structure tree.
            Nodes affect all their children, so <RegexHighlighter regex={"a*"} inline/> would be represented as
            operator <code>*</code> with child <code>a</code>.<br/>
            Please be aware that by lecture convention, all group operators (alteration and concatenation) are binary.
        </StepHelp>
    </>
}
