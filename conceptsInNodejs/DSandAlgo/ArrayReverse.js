function reverseArray(inp) {
    for (let i = 0, j = inp.length - 1; i < j; i++, j--) {
        let temp = inp[i];
        inp[i] = inp[j];
        inp[j] = temp;
    }
}

function main() {
    let inp = [1, 2, 3, 4, 5, 6];
    reverseArray(inp);
    inp.forEach((value) => console.log(value));
}

main();