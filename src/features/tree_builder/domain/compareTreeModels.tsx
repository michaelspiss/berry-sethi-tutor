import {RegexTreeGroup, RegexTreeItem, RegexTreeQuantifier} from "@/analyze_regex/domain/models/regexTree";

/**
 * Compares attributes of each tree item. Expects the trees to have the same nodes.
 * @param sourceOfTruth
 * @param userTree
 * @param comparator
 */
export default function compareTreeModels(sourceOfTruth: RegexTreeItem, userTree: RegexTreeItem, comparator: (truth: RegexTreeItem, userItem: RegexTreeItem) => boolean): RegexTreeItem[] {
    const errorItems: RegexTreeItem[] = [];
    if (!comparator(sourceOfTruth, userTree)) {
        errorItems.push(userTree);
    }

    if (sourceOfTruth instanceof RegexTreeQuantifier) {
        errorItems.push(...compareTreeModels(sourceOfTruth.child, (userTree as RegexTreeQuantifier).child, comparator))
    } else if (sourceOfTruth instanceof RegexTreeGroup) {
        for (let i = 0; i < sourceOfTruth.children.length; i++) {
            errorItems.push(...compareTreeModels(
                sourceOfTruth.children[i],
                (userTree as RegexTreeGroup).children[i],
                comparator,
            ));
        }
    }

    return errorItems;
}
