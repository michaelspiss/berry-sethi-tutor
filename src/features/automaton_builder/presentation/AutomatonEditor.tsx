import {createStyles, Textarea} from "@mantine/core";
import {useFocusTrap} from "@mantine/hooks";
import useAutomaton from "@/automaton_builder/presentation/useAutomaton";

const useStyles = createStyles(theme => ({
    wrapper : {
        flexGrow: 1,
        position: "relative",
        maxWidth: 300,
    },
    styled: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 1,
        padding: theme.spacing.md,
        fontFamily: "Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New",
        fontSize: 14,
        border: `1px solid transparent`,
    },
    inputRoot: {
        position: "relative",
        zIndex: 2,
        height: "100%",
        width: "100%",
    },
    inputWrapper: {
        height: "100%",
    },
    input: {
        height: "100%",
        borderRadius: 0,
        color: "transparent",
        background: "transparent",
        padding: theme.spacing.md,
        fontFamily: "Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New",
        fontSize: 14,
        caretColor: "black",
    }
}))

export default function AutomatonEditor() {
    const {classes} = useStyles();
    const value = useAutomaton(state => state.definition);
    const focusTrap = useFocusTrap();

    return <div className={classes.wrapper} ref={focusTrap}>
        {/* TODO: split lines, parse lines, build automaton */}
        <Textarea
            classNames={{root: classes.inputRoot, input: classes.input, wrapper: classes.inputWrapper}}
            defaultValue={value}
            onChange={(event) => useAutomaton.setState({definition: event.currentTarget.value})}
        />
        <div className={classes.styled}>
            {value /* TODO: format */}
        </div>
    </div>
}
