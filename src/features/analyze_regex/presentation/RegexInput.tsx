import {Box, createStyles, TextInput} from "@mantine/core";
import {getHotkeyHandler, useFocusTrap} from "@mantine/hooks";
import useAppStateStore from "@/layout/stores/appStateStore";
import RegexHighlighter from "@/analyze_regex/presentation/RegexHighlighter";


const useStyles = createStyles(() => ({
    wrapper: {
        position: "relative",
        maxWidth: "100% !important",
        flexGrow: 1,
    },
    inputRoot: {
        position: "relative",
        zIndex: 2,
    },
    input: {
        background: "transparent",
        color: "transparent",
        fontFamily: "Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New",
        fontSize: 14,
        caretColor: "black",
        wordBreak: "break-all",
        overflow: "hidden",
        lineHeight: "24px",
        padding: "5px 12px"
    },
    highlighter: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        border: "1px solid transparent",
        padding: "5px 12px",
        fontFamily: "Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New",
        fontSize: 14,
        lineHeight: "24px"
    },
}))

interface RegexInputProps {
    errorPosition?: number,
    resetErrorPos: () => void,
    onEnter: () => void
}

/**
 * Text input with live color highlighting
 * @param props
 * @constructor
 */
export default function RegexInput(props: RegexInputProps) {
    const {classes} = useStyles();
    const regexValue = useAppStateStore((state) => state.regex)

    const focusTrap = useFocusTrap();

    return <Box className={classes.wrapper} ref={focusTrap}>
        <TextInput
            id={"regexInput"}
            maxLength={48}
            onBlur={event => event.currentTarget.focus()}
            classNames={{root: classes.inputRoot, input: classes.input}}
            onChange={(event) => {
                const newRegexValue = event.currentTarget.value.trim().replaceAll(/[\r\n.·]/g, "");
                if (newRegexValue !== regexValue) {
                    props.resetErrorPos();
                    useAppStateStore.setState({regex: newRegexValue});
                }
            }}
            value={regexValue}
            onKeyDown={getHotkeyHandler([['Enter', props.onEnter]])}
            placeholder={"Regex"}
        />
        <RegexHighlighter regex={regexValue} className={classes.highlighter} errorPosition={props.errorPosition}/>
    </Box>
}
