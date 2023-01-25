import StepHelp from "@/tree_builder/presentation/StepHelp";
import RegexHighlighter from "@/analyze_regex/presentation/RegexHighlighter";
import {Table} from "@mantine/core";

export default function SyntaxTreeHelper() {
    return <>
        Drag nodes from the bottom toolbar to build the syntax tree.
        <StepHelp>
            The syntax tree is a representation of the original regular expression as data structure tree.
            Nodes affect all their children - as operators affect their operands.
            <RegexHighlighter regex={" a*"} inline/> would be represented as
            operator <code>*</code> with child <code>a</code>.<br/>
            <RegexHighlighter regex={"a|b"} inline/> as operator <code>|</code> with children <code>a</code> and <code>b</code>.<br/>
            Please be aware that by lecture convention, group operators (alteration and concatenation) are binary.<br/>
            <br/>
            <Table>
                <thead>
                    <tr>
                        <th style={{width: 70}}>Symbol</th>
                        <th>Meaning</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><RegexHighlighter regex={"*"} inline/></td>
                        <td>Matches the preceding group/terminal zero to unlimited times</td>
                    </tr>
                    <tr>
                        <td><RegexHighlighter regex={"+"} inline/></td>
                        <td>Matches the preceding group/terminal one to unlimited times</td>
                    </tr>
                    <tr>
                        <td><RegexHighlighter regex={"?"} inline/></td>
                        <td>Makes the preceding group/terminal optional</td>
                    </tr>
                    <tr>
                        <td><RegexHighlighter regex={"|"} inline/></td>
                        <td>Infix alteration operator "or"</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Implicit infix concatenation operator, displayed as • in the syntax tree</td>
                    </tr>
                </tbody>
            </Table>
        </StepHelp>
    </>
}
