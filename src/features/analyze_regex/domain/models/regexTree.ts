export type RegexQuantifier = '?' | '*' | '+';

export abstract class RegexTreeItem {
    abstract getPossibleStrings(): Set<string>
}

export abstract class RegexTreeGroup extends RegexTreeItem {
    readonly children: RegexTreeItem[] = [];

    /**
     * Adds a new treeItem to the end of the array
     * @param treeItem
     */
    pushChild(treeItem: RegexTreeItem) {
        this.children.push(treeItem);
    }

    /**
     * Removes the last child from the this.children array and returns it.
     * undefined if this.children is empty
     */
    popChild() {
        return this.children.pop()
    }

    /**
     * Returns the last child in this.children, or undefined if there are none
     */
    getLastChild() {
        return this.children.slice(-1)[0];
    }
}

export class RegexTreeTerminal extends RegexTreeItem {
    readonly symbol: string;
    readonly index: number;

    constructor(symbol: string, index: number) {
        super();
        this.symbol = symbol;
        this.index = index;
    }

    getPossibleStrings(): Set<string> {
        return new Set([this.symbol])
    }
}

/**
 * Represents one of the following regex quantifiers: ?, +, *
 */
export class RegexTreeQuantifier extends RegexTreeItem {
    readonly symbol: RegexQuantifier;
    public child: RegexTreeItem;

    constructor(symbol: RegexQuantifier, child: RegexTreeItem) {
        super();
        this.symbol = symbol;
        this.child = child;
    }

    /**
     * For + and *, the "or more" states are represented by the cartesian product
     * of the child's possible value with themselves. This is not entirely correct,
     * since it leaves out 3 and more repetitions of the child node's values, but
     * should be sufficient to get a set of valid input data. For
     */
    getPossibleStrings(): Set<string> {
        const possibleChildStrings = this.child.getPossibleStrings();

        if (this.symbol == "?") {
            return new Set(possibleChildStrings).add("")
        }

        const concatenatedChildStrings: string[] = []
        possibleChildStrings.forEach((str1) => {
            possibleChildStrings.forEach((str2) => {
                concatenatedChildStrings.push(str1 + str2)
            });
        });

        if (this.symbol == "*") {
            return new Set([...possibleChildStrings, ...concatenatedChildStrings]).add("");
        }

        // else: symbol == "+" -> no empty string
        return new Set([...possibleChildStrings, ...concatenatedChildStrings]);
    }
}


export class RegexTreeAlteration extends RegexTreeGroup {
    getPossibleStrings(): Set<string> {
        const possibleStrings: string[] = [];

        this.children.forEach((treeItem) => {
            possibleStrings.push(...treeItem.getPossibleStrings())
        });

        return new Set(possibleStrings);
    }
}

export class RegexTreeConcatenation extends RegexTreeGroup {
    getPossibleStrings(): Set<string> {
        const possibleStringsPerChild: Set<string>[] = [];

        this.children.forEach((treeItem) => {
            possibleStringsPerChild.push(treeItem.getPossibleStrings())
        })

        let concatenations = possibleStringsPerChild[0];
        for (let i = 1; i < possibleStringsPerChild.length; i++) {
            const newConcatenations = new Set<string>();
            concatenations.forEach((previousStepString) => {
                possibleStringsPerChild[i].forEach((nextString) => {
                    newConcatenations.add(previousStepString + nextString)
                })
            });
            concatenations = newConcatenations;
        }

        return new Set(concatenations);
    }
}
