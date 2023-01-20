import {Button, Center, Group, Paper, Text, Title, useMantineTheme} from "@mantine/core";
import LectureConventions from "@/layout/presentation/LectureConventions";
import {useEventListener} from "@mantine/hooks";
import {useState} from "react";
import parseRegex from "@/analyze_regex/domain/usecases/parseRegex";
import RegexError from "@/analyze_regex/domain/models/regexError";
import useAppStateStore from "@/layout/stores/appStateStore";
import RegexInput from "@/analyze_regex/presentation/RegexInput";
import DefaultError from "@/layout/presentation/DefaultError";

const RegexExample = (props: { regex: string }) => {
    return <Text color={"blue"}
                 style={{cursor: "pointer"}}
                 underline
                 span
                 onClick={() => useAppStateStore.setState({regex: props.regex})}>
        {props.regex}
    </Text>
}

/**
 * Displays a screen which allows the user to input a custom regular expression for the tutor to use.
 * Displays errors if entered regex contains any
 * @constructor
 */
export default function RegexInputScreen() {
    const theme = useMantineTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<RegexError | null>(null);

    const formRef = useEventListener('submit', (event) => {
        event.preventDefault();
        let regex = useAppStateStore.getState().regex;

        if (regex.trim() === "") {
            return
        }

        setIsLoading(true);
        try {
            const regexModel = parseRegex(regex);
            setError(null);
            const simplifiedRegex = regexModel.getRegex();
            if (simplifiedRegex !== regex) {
                useAppStateStore.setState({regex: simplifiedRegex, isSimplified: true})
            }
            useAppStateStore.setState({regexModel, solveStep: 0});
        } catch (e) {
            if (e instanceof RegexError) {
                setError(e);
            } else {
                throw e
            }
        } finally {
            setIsLoading(false);
        }
    });

    return <Center style={{height: "100%"}}>
        <Paper p={"xl"}
               shadow={"lg"}
               withBorder={true}
               style={{width: theme.spacing.xl * 40}}
               mb={theme.other.headerHeight}>
            <form ref={formRef}>
                <Title order={6}>Input regular expression</Title>
                <Group grow style={{alignItems: "stretch"}}>
                    <RegexInput errorPosition={!error ? undefined : error.position}
                                resetErrorPos={() => {
                                    if (error !== null && error?.position !== -1) {
                                        setError(new RegexError(error!.title, error!.message, -1))
                                    }
                                }}
                                onEnter={() => {
                                    formRef.current.dispatchEvent(new Event("submit", {cancelable: true}));
                                }}/>
                    <Button style={{flexGrow: 0}} variant={"outline"} onClick={() => {
                        const input = document.getElementById("regexInput")! as HTMLInputElement;
                        console.log(input.selectionStart)
                        const pos = input.selectionStart ?? input.value.length - 1;
                        const value = input.value;
                        useAppStateStore.setState({regex: value.substring(0, pos) + "ε" + value.substring(pos)});
                        setTimeout(() => {
                            input.focus();
                            input.setSelectionRange(pos + 1, pos + 1);
                        }, 50)
                    }}>ε</Button>
                    <Button style={{flexGrow: 0}} type={"submit"} loading={isLoading}>Start</Button>
                </Group>
                <Text size={"sm"} pb={"md"}>Or try one of the lecture examples: <RegexExample
                    regex={"(a|b)*db|c*"}/>, <RegexExample regex={"a(ab*)*|b|a*"}/>, <RegexExample regex={"ε|(ba)c(a|b)*"}/>, <RegexExample
                    regex={"(ab|ε)*"}/>, <RegexExample regex={"(a|b)*aa|b"}/>, </Text>
            </form>
            {!error ? null : <DefaultError title={error.title} message={error.message}/>}
            <LectureConventions/>
        </Paper>
    </Center>
}
