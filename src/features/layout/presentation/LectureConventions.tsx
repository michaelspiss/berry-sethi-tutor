import {Accordion, List, Text, ThemeIcon} from "@mantine/core";
import {IconAlertCircle} from "@tabler/icons";
import {useLocalStorage} from "@mantine/hooks";

/**
 * Displays a list of all lecture conventions which are being used in this program
 * @constructor
 */
export default function LectureConventions() {
    const [opened, setOpened] = useLocalStorage({key: "openConventions", defaultValue: true});

    return <Accordion value={opened ? "conventions" : null}
                      onChange={(v) => setOpened(v === "conventions")}
                      variant={"contained"}
    >
        <Accordion.Item value={"conventions"}>
            <Accordion.Control icon={<ThemeIcon color={"yellow"} variant={"light"}
            ><IconAlertCircle size={16}/></ThemeIcon>}><Text color={"yellow"}
                                                             weight="bold">Lecture Conventions</Text></Accordion.Control>
            <Accordion.Panel>
                The lecture uses the following conventions for regular expressions, which
                also apply to this tool:
                <List>
                    <List.Item>Every letter is its own terminal</List.Item>
                    <List.Item>The following operators are supported: <code>*?+|</code>, groups and concatenation</List.Item>
                    <List.Item>The concatenation operator is binary and implicit</List.Item>
                </List>
            </Accordion.Panel>
        </Accordion.Item>
    </Accordion>
}
