import {
    ActionIcon,
    AppShell,
    Button,
    Center,
    Group,
    Header,
    MantineProvider,
    Navbar,
    ScrollArea,
    Text,
    Tooltip
} from '@mantine/core';
import mantineThemeOther from "./configuration/mantineThemeOther";
import useAppStateStore from "@/layout/stores/appStateStore";
import StepsProgress from "@/layout/presentation/StepsProgress";
import RegexInputScreen from "@/analyze_regex/presentation/screens/RegexInputScreen";
import {IconAlertTriangle, IconArrowBack} from "@tabler/icons";
import RegexHighlighter from "@/analyze_regex/presentation/RegexHighlighter";
import SolveButton from "@/tree_builder/presentation/SolveButton";
import VerifyTreeButton from "@/tree_builder/presentation/VerifyTreeButton";
import NodeAttributeLegend from "@/tree_builder/presentation/NodeAttributeLegend";
import AutomatonBuilderScreen from "@/automaton_builder/presentation/AutomatonBuilderScreen";
import TreeBuilderScreen from "@/tree_builder/presentation/screens/TreeBuilderScreen";
import backToHome from "./backToHome";
import CompletionModal from "@/tree_builder/presentation/CompletionModal";
import steps from "@/tree_builder/domain/steps";

export default function App() {
    const solveStep = useAppStateStore((state) => state.solveStep);
    const regexValue = useAppStateStore((state) => state.regex);
    const isSimplified = useAppStateStore(state => state.isSimplified);

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={{
            primaryShade: 7,
            other: mantineThemeOther,
        }}>
            <AppShell padding={0}
                      header={
                          <Header height={mantineThemeOther.headerHeight} px={"xs"}>
                              <Group position={"apart"}>
                                  <Center style={{height: mantineThemeOther.headerHeight}} inline>
                                      {solveStep === -1 ? null :
                                          <ActionIcon onClick={backToHome}>
                                              <IconArrowBack size={16}/>
                                          </ActionIcon>
                                      }
                                      <span>Berry Sethi Tutor</span>
                                  </Center>
                                  {solveStep === -1 ? null : <>
                                      <Center style={{height: mantineThemeOther.headerHeight}}>{
                                          <Group>
                                              <RegexHighlighter regex={regexValue}/>
                                              {
                                                  isSimplified ? <Tooltip
                                                      withArrow
                                                      label={"Redundant groups have been removed"}>
                                                      <Center pt={2}>
                                                          <IconAlertTriangle size={16} color={"orange"}/>
                                                      </Center>
                                                  </Tooltip> : null
                                              }
                                          </Group>
                                      }</Center>
                                      <Center style={{height: mantineThemeOther.headerHeight}}>
                                          <Group>
                                              <Button onClick={steps[solveStep]?.reset} color={"red"}>Reset step</Button>
                                              <SolveButton/>
                                              <VerifyTreeButton/>
                                          </Group>
                                      </Center>
                                  </>
                                  }
                              </Group>

                          </Header>
                      }
                      navbar={
                          solveStep === -1 ? undefined : <Navbar width={{base: 240}} p={"xs"}>
                              <Navbar.Section component={ScrollArea} grow>
                                  <StepsProgress activeStep={solveStep}/>
                              </Navbar.Section>
                              <Navbar.Section>
                                  <Text size="xs" weight={500} color="dimmed" pb={10}>
                                      Reference
                                  </Text>
                                  <NodeAttributeLegend/>
                              </Navbar.Section>
                          </Navbar>
                      }>
                {solveStep === -1
                    ? <RegexInputScreen/>
                    : solveStep === 7
                        ? <AutomatonBuilderScreen/>
                        : <TreeBuilderScreen/>}
            </AppShell>
            <CompletionModal/>
        </MantineProvider>
    );
}
