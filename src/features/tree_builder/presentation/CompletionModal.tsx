import {ActionIcon, Box, Button, Divider, Flex, Group, Modal, Text, useMantineTheme} from "@mantine/core";
import useAppStateStore from "@/layout/stores/appStateStore";
import backToHome from "../../../backToHome";
import AutomatonPreview from "@/automaton_builder/presentation/AutomatonPreview";
import InteractiveTreeBuilder from "@/tree_builder/presentation/InteractiveTreeBuilder";
import RegexHighlighter from "@/analyze_regex/presentation/RegexHighlighter";
import {IconCircleCheck, IconInfoCircle} from "@tabler/icons";
import {useState} from "react";

export default function CompletionModal() {
    const isOpen = useAppStateStore(state => state.isDone);
    const regex = useAppStateStore(state => state.regex);
    const theme = useMantineTheme();
    const [displayCredits, setDisplayCredits] = useState(false);

    return <Modal opened={isOpen}
                  onClose={() => useAppStateStore.setState({isDone: false})}
                  closeOnClickOutside={false}
                  closeOnEscape={false}
                  withCloseButton={false}
                  overlayBlur={5}
                  overlayColor={theme.colors.gray[5]}
                  overlayOpacity={.5}
                  size={displayCredits ? "75%" : "50%"}
                  styles={{modal: {
                      minWidth: 450
                      }}}
    >
        <Group noWrap>
            <Box w={displayCredits ? "66.666%" : "100%"}>
                <Flex align={"center"} pb={theme.spacing.md}>
                    <IconCircleCheck color={theme.colors.green[8]} size={56}/>
                    <Box pl={theme.spacing.md}>
                        Well done! You completed the Berry-Sethi construction for the regular expression <RegexHighlighter regex={regex} inline/>
                    </Box>
                </Flex>

                <div style={{height: "65vh", minHeight: 400, width: "100%", display: "flex", flexDirection: "column"}}>
                    <InteractiveTreeBuilder/>
                    <AutomatonPreview />
                </div>
            </Box>
            {displayCredits ? <Divider orientation="vertical" variant="dashed" /> : null}
            {displayCredits ? <Box w={"33.333%"}>
                <svg width="120" height="63" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 73 38">
                    <path d="M28 0v31h8V0h37v38h-7V7h-8v31h-7V7h-8v31H21V7h-7v31H7V7H0V0h28z" fill="rgb(48, 112, 179)"></path>
                </svg>
                <Text size={14}>
                    Technical University of Munich<br/>
                    <br/>
                    Bachelor's Thesis in Informatics<br/>
                    For the Course Compiler Construction<br/>
                    At the chair I2<br/>
                    <br/>
                    By Michael Spiss<br/>
                    Advised by Dr. Michael Petter
                </Text>
            </Box> : null}
        </Group>
        <Group pt={theme.spacing.md} position={"apart"}>
            <Group>
                <Button onClick={() => useAppStateStore.setState({isDone: false})} variant={"outline"} color={"blue"}>Back to last step</Button>
                <Button onClick={backToHome} variant={"filled"}>Attempt another regular expression</Button>
            </Group>
            <ActionIcon color={"gray"} size={36} variant={"outline"} onClick={() => setDisplayCredits(!displayCredits)}><IconInfoCircle /></ActionIcon>
        </Group>
    </Modal>
}
