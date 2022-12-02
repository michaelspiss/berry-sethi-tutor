import React from "react";
import {Code, Group, Title} from "@mantine/core";
import RegexHighlighter from "@/analyze_regex/presentation/RegexHighlighter";
import {IconArrowRight} from "@tabler/icons";

/**
 * Returned by buildRegexTree for errors within the user-supplied regex string
 */
export default class RegexError {
    /**
     * A short description of the error
     */
    readonly title: string;

    /**
     * Should include a tip on how to resolve the note's cause
     */
    readonly message: React.ReactElement;

    /**
     * The position of the note's cause in the original regex string
     */
    readonly position: number;

    constructor(title: string, message: React.ReactElement, position: number) {
        this.title = title;
        this.message = message;
        this.position = position;
    }
}

export const RegexErrors = {
    alterationMissingFirstParameter: (position: number) => {
        return new RegexError(
            "Alteration is missing its first parameter",
            <>
                You have an alteration <Code>|</Code> at the start of the regex or a group.<br/>
                An alteration is an infix operator, so it needs to have parameters before and after.
                <Group my={"xs"}>
                    <Title order={6}>Example: </Title>
                    <RegexHighlighter regex={"|b"} errorPosition={0} />
                    <IconArrowRight size={16} />
                    <RegexHighlighter regex={"a|b"}/>
                </Group>
            </>,
            position,
        );
    },
    alterationMissingSecondParameter: (position: number) => {
        return new RegexError(
            "Alteration is missing second parameter",
            <>
                You have an alteration <Code>|</Code> at the end of the regex or a group.<br/>
                An alteration is an infix operator, so it needs to have parameters before and after.
                <Group my={"xs"}>
                    <Title order={6}>Example: </Title>
                    <RegexHighlighter regex={"a|"} errorPosition={1} />
                    <IconArrowRight size={16} />
                    <RegexHighlighter regex={"a|b"}/>
                </Group>
            </>,
            position,
        );
    },
    groupMissingClosingParenthesis: (position: number) => {
        return new RegexError(
            "Missing closing parenthesis for group",
            <>
                You started a new group with <Code>(</Code>, but never closed it with its counterpart <Code>)</Code>.<br />
                Try either removing the parenthesis or add a <Code>)</Code> at the group's end.
                <Group my={"xs"}>
                    <Title order={6}>Example: </Title>
                    <RegexHighlighter regex={"(ab"} errorPosition={0}/>
                    <IconArrowRight size={16} />
                    <RegexHighlighter regex={"(ab)"}/>
                </Group>
            </>,
            position,
        );
    },
    groupMissingOpeningParenthesis: (position: number) => {
        return new RegexError(
            "Closing group that has never been opened",
            <>
                You closed a group with <Code>)</Code> which has never been opened with its counterpart <Code>(</Code><br />
                Try either removing the parenthesis or add a <Code>(</Code> at the group's start.
                <Group my={"xs"}>
                    <Title order={6}>Example: </Title>
                    <RegexHighlighter regex={"ab)"} errorPosition={2}/>
                    <IconArrowRight size={16} />
                    <RegexHighlighter regex={"(ab)"}/>
                </Group>
            </>,
            position,
        );
    },
    cannotApplyQuantifierToAlteration: (position: number) => {
        return new RegexError(
            "Quantifier cannot be applied to alteration operator",
            <>
                It seems like you are missing the second parameter of the alteration <Code>|</Code>.<br />
                An alteration is an infix operator, so it needs to have parameters before and after.
                <Group my={"xs"}>
                    <Title order={6}>Example: </Title>
                    <RegexHighlighter regex={"a|*"} errorPosition={2}/>
                    <IconArrowRight size={16} />
                    <RegexHighlighter regex={"a|b*"}/>
                </Group>
                If you want to apply the quantifier <Code>*</Code>/<Code>?</Code>/<Code>+</Code> to the whole alteration, wrap it in a group.
                <Group my={"xs"}>
                    <Title order={6}>Example: </Title>
                    <RegexHighlighter regex={"a|?"} errorPosition={2}/>
                    <IconArrowRight size={16} />
                    <RegexHighlighter regex={"(a|b)?"}/>
                </Group>
            </>,
            position,
        );
    },
    quantifierRequiresNode: (position: number) => {
        return new RegexError(
            "Quantifier requires node to quantify",
            <>
                You have a quantifier <Code>*</Code>/<Code>?</Code>/<Code>+</Code> at the start of the regex or a group.<br/>
                Quantifiers are suffix operators, so it needs to have a parameter before it.
                <Group my={"xs"}>
                    <Title order={6}>Example: </Title>
                    <RegexHighlighter regex={"?b"} errorPosition={0}/>
                    <IconArrowRight size={16} />
                    <RegexHighlighter regex={"a?b"}/>
                </Group>
            </>,
            position,
        );
    },
    cannotQuantifyQuantifier: (position: number) => {
        return new RegexError(
            "Cannot quantify quantifier",
            <>
                You have a quantifier <Code>*</Code>/<Code>?</Code>/<Code>+</Code> right after another.<br/>
                Quantifiers themselves are not quantifiable. Try removing one.
                <Group my={"xs"}>
                    <Title order={6}>Example: </Title>
                    <RegexHighlighter regex={"a??"} errorPosition={2}/>
                    <IconArrowRight size={16} />
                    <RegexHighlighter regex={"a?"}/>
                </Group>
            </>,
            position,
        );
    }
}
