import {Box, Button, Flex, Group, Modal, useMantineTheme} from "@mantine/core";
import useAppStateStore from "@/layout/stores/appStateStore";
import backToHome from "../../../backToHome";
import AutomatonPreview from "@/automaton_builder/presentation/AutomatonPreview";
import InteractiveTreeBuilder from "@/tree_builder/presentation/InteractiveTreeBuilder";
import RegexHighlighter from "@/analyze_regex/presentation/RegexHighlighter";
import {IconCircleCheck} from "@tabler/icons";

export default function CompletionModal() {
    const isOpen = useAppStateStore(state => state.isDone);
    const regex = useAppStateStore(state => state.regex);
    const theme = useMantineTheme();

    return <Modal opened={isOpen}
                  onClose={() => useAppStateStore.setState({isDone: false})}
                  closeOnClickOutside={false}
                  closeOnEscape={false}
                  withCloseButton={false}
                  overlayBlur={5}
                  overlayColor={theme.colors.gray[5]}
                  overlayOpacity={.5}
                  size={"50%"}
                  styles={{modal: {
                      minWidth: 450
                      }}}
    >
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
        <Group pt={theme.spacing.md}>
            <Button onClick={() => useAppStateStore.setState({isDone: false})} variant={"outline"} color={"blue"}>Back to last step</Button>
            <Button onClick={backToHome} variant={"filled"}>Attempt another regular expression</Button>
        </Group>
    </Modal>
}
