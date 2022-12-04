import {createStyles, useMantineTheme} from "@mantine/core";
import {useMemo} from "react";
import segmentRegexString from "@/analyze_regex/domain/usecases/segmentRegexString";

const useStyles = createStyles(() => ({
    wrapper: {
        margin: 0,
        wordBreak: "break-all",
    }
}))

interface RegexHighlighterProps {
    regex: string,
    className?: string,
    errorPosition?: number,
}

/**
 * Displays the regex in an easy-to-read, color formatted way
 * @param props
 * @constructor
 */
export default function RegexHighlighter(props: RegexHighlighterProps) {
    const {classes, cx} = useStyles();
    const theme = useMantineTheme();
    const errorPos = props.errorPosition ?? -1;
    let formattedRegex: ReturnType<typeof segmentRegexString> = useMemo(
        () => segmentRegexString(props.regex, errorPos),
        [props.regex, errorPos]
    );

    return <pre className={cx(classes.wrapper, props.className)}>{(formattedRegex).map(item => {
        switch (item.type) {
            case 'quantifier':
                return <span key={item.key}
                             style={{color: theme.colors.blue[8], fontWeight: "bold"}}>{item.symbols}</span>
            case 'error':
                return <span key={item.key} style={{
                    color: theme.colors.red[6],
                    textDecorationLine: "underline",
                    textDecorationSkipInk: "none",
                    textDecorationThickness: 2,
                    textUnderlinePosition: "under",
                }}>{item.symbols}</span>
            case 'escaped':
                return <span key={item.key} style={{color: theme.colors.orange[6]}}>{item.symbols}</span>
            case 'group':
                return <span key={item.key}
                             style={{color: theme.colors.gray[6], fontWeight: "bold"}}>{item.symbols}</span>
            case 'alteration':
                return <span key={item.key}
                             style={{color: theme.colors.green[8], fontWeight: "bold"}}>{item.symbols}</span>
            case 'terminal':
                return <span key={item.key} style={{color: theme.colors.gray[9]}}>{item.symbols}</span>
        }
    })}</pre>
}
