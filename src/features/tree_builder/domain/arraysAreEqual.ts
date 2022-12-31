export default function arraysAreEqual<T>(array1: T[], array2: T[]) {
    if(array1.length !== array2.length) {
        return false;
    }
    const array1Sorted = array1.slice().sort();
    return array2.slice().sort().every((value, index) => value === array1Sorted[index]);
}
