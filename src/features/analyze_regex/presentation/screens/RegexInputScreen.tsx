import {Alert, Button, Center, Group, Paper, useMantineTheme} from "@mantine/core";
import LectureConventions from "@/layout/presentation/LectureConventions";
import {useEventListener} from "@mantine/hooks";
import {useState} from "react";
import parseRegex from "@/analyze_regex/domain/usecases/parseRegex";
import RegexError from "@/analyze_regex/domain/models/regexError";
import useAppStateStore from "@/layout/stores/appStateStore";
import {IconAlertCircle} from "@tabler/icons";
import RegexInput from "@/analyze_regex/presentation/RegexInput";

/**
 * Displays a screen which allows the user to input a custom regular expression for the tutor to use.
 * Displays errors if entered regex contains any
 * @constructor
 */
export default function RegexInputScreen() {
    const theme = useMantineTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<RegexError | null>(null);

    const submitRef = useEventListener('submit', (event) => {
        event.preventDefault();
        const regex = useAppStateStore.getState().regex;

        if (regex.trim() === "") {
            return
        }

        setIsLoading(true);
        try {
            const regexModel = parseRegex(regex);
            setError(null);
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
            <form ref={submitRef}>
                <Group grow style={{alignItems: "stretch", paddingBottom: 16}}>
                    <RegexInput errorPosition={!error ? undefined : error.position}
                                resetErrorPos={() => {
                                    if(error !== null && error?.position !== -1) {
                                        setError(new RegexError(error!.title, error!.message, -1))
                                    }
                                }} />
                    <Button style={{flexGrow: 0}} type={"submit"} loading={isLoading}>Start</Button>
                </Group>
            </form>
            {
                !error ? null : <Alert icon={<IconAlertCircle size={16}/>}
                                       color={"red"}
                                       title={error.title}
                                       mb={"md"}>
                    {error.message}
                </Alert>
            }
            <LectureConventions/>
        </Paper>
    </Center>
}
