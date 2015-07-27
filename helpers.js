var unnestMap = R.compose(R.unnest, R.map);

// returns the first n elements in the array [x, f(x), f(f(x)), ...]
var iterate = function (n, f, x) {
    return R.scan(function (y) { return f(y); }, x, R.range(0, n - 1));
};

// reterns a list of all prefixes of xs
var prefixes = function (xs) {
    return iterate(xs.length, R.init, xs)
};

// var prefixes = function (word) {
//     return R.map(
//         function (i) { return word.slice(0, i); },
//         R.range(1, word.length + 1)
//     );
// };


var isProperPrefix = function (p, q) {
    return p.length < q.length && q.startsWith(p);
};

var isLeaf = function (tree) {
    return tree.children.length === 0;
};

var isEven = function (tree) {
    return R.mathMod(tree.value.length, 2) === 0;
};

var getLeaves = function (tree) {
    return isLeaf(tree) ?
        [tree.value] : unnestMap(getLeaves, tree.children);
};

// var fasterSortByLength = function (words) {
//     var groupedWords = R.groupBy(R.prop("length"), words);
//     var sortedWords = [[""]];
//     for (var key in groupedWords) {
//         if (groupedWords.hasOwnProperty(key)) {
//             sortedWords[+key] = groupedWords[key];
//         }
//     }
//     return R.tail(R.unnest(sortedWords));
// };
