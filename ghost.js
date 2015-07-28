// depends on 'helpers.js' and 'ramda.js'

// First we get the dictionary from the path specified at the bottom of the
// file. Nothing very interesting happens in this function.
var getDictionary = function (path) {
    var client = new XMLHttpRequest(),
        that = this;
    client.open("GET", path);
    client.onreadystatechange = function () {
        // We wait for the dictionary to download before continuing.
        if (4 != client.readyState || 200 != client.status) {
            return;
        }
        ghost(client.responseText.split('\n'));
    };
    client.send();
};

// The meat of the solution.
var ghost = function (dictionary) {
    var prefixes, tree, monoTrees, winnningWordsByStartLetter;

    console.log("processing dictionary...");
    dictionary = processDictionary(dictionary);

    console.log("populating prefixes...(this takes a while)");
    prefixes = populatePrefixes(dictionary);

    console.log("building tree...");
    tree = buildTree(prefixes);

    console.log("painting tree...");
    paint(tree);

    console.log("splitting by start letter and making monochrome...");
    monoTrees = R.forEach(makeMono, tree.children);

    console.log("pruning each tree...");
    R.forEach(prune, monoTrees);

    console.log("retrieving winning words...");
    winnningWordsByStartLetter = R.sortBy(
        R.prop("startLetter"),
        R.map(getWinningWords, monoTrees)
    );

    console.log("printing winning words...")
    R.forEach(printWinningWords, winnningWordsByStartLetter);

    console.log("Done!")
}

// Delete all words of length <=2 and all unreachable words.
var processDictionary = function (dictionary) {
    var filterShortWords = R.filter(function (w) { return w.length > 2; });
    var filterPrefixes = R.filter(function (p) {
            return !R.any(function (q) { return isProperPrefix(p,q); },
                dictionary);
        });
    return R.sortBy(R.identity, filterPrefixes(filterShortWords(dictionary)));
}

// Returns an array of all the prefixes of all the words in our dictionary.
// This is how we would like to implement this...
// var populatePrefixes = R.compose(
//     R.sortBy(function (s) { return s.length; }),
//     R.uniq,
//     unnestMap(prefixes)
// );
// ...but this is a lot faster:
// We rely on the fact that our input is sorted alphabetically, and carefully
// build our list of prefixes without duplication and in order of length.
var populatePrefixes = function (dictionary) {
    var prefixes = [];
    var lastAddition = "";
    var charsToTake = 1;
    var done = false;
    while (!done) {
        done = true;
        for (var i = 0; i < dictionary.length; i++) {
            if (dictionary[i].length > charsToTake) {
                done = false;
            }
            if (dictionary[i].length >= charsToTake &&
                dictionary[i].slice(0, charsToTake) != lastAddition) {
                lastAddition = dictionary[i].slice(0, charsToTake);
                prefixes.push(lastAddition);
            }
        }
        charsToTake++;
    }
    return prefixes;
};

// Builds the whole tree from prefixes, rather than just one vertex like the
// constructor below.
var buildTree = function (prefixes) {
    var tree = constructTree("");
    R.forEach(function (p) { tree.insert(p); }, prefixes);
    return tree;
}

// Constructs a tree with the specified value and empty children.
var constructTree = function (value) {
    return {
        children: [],
        value: value,

        // The insert method places a string in the tree at a vertex whose value
        // is a prefix of it, and precicely one character shorter. The resulting
        // tree is in fact a 'trie' (see wikipedia.org/trie).
        // Note also that the order in which we add our strings matters. We must
        // add from shortest to longest.
        insert: function (newValue) {
            if (newValue.length === this.value.length + 1) {
                this.children.push(constructTree(newValue));
            }
            else {
                R.find(
                    function (t) { return newValue.startsWith(t.value); },
                    this.children
                ).insert(newValue);
            }
        }
    };
}

// The paint function assigns a colour to a tree (and necessarily all its
// subtrees). "green" if player 1 could force a win from it, and "red"
// if player 2 could. Every vertex is either red or green as for each
// vertex player 1 can only fail to force a win if player 2 can force a
// win.
//
// A vertex is green if
//  - it is an even valued leaf OR
//  - it is an even valued vertex with at least one green child OR
//  - it is an odd valued non leaf with only green children
// otherwise it is red.
var paint = function (tree) {
    var hasAnyGreen = R.any(R.propEq("colour", "green"));
    var hasAllGreen = R.all(R.propEq("colour", "green"));

    R.forEach(paint, tree.children);

    if (isEven(tree) && (isLeaf(tree) || hasAnyGreen(tree.children)) ||
    !isEven(tree) && !isLeaf(tree) && hasAllGreen(tree.children)) {
        tree.colour = "green";
    }
    else {
        tree.colour = "red";
    }
};

// we consider the winning moves conditioned on the first move, otherwise the
// result isn't very interesting...
var makeMono = function (tree) {
    tree.children = R.filter(R.propEq("colour", tree.colour), tree.children);
    R.forEach(makeMono, tree.children);
};

// we prune each tree to produce a minimal closed set of winning words
var prune = function (tree) {
    var calculateDescendantLeaves =  R.compose(
        R.sum,
        R.pluck("descendantLeaves")
    );

    var findSmallestBranch = R.reduce(
        R.minBy(R.prop("descendantLeaves")),
        R.head(tree.children)
    );

    R.forEach(prune, tree.children);

    // We can only prune our tree when it is the winning player's choice of
    // move. Every move the opponent could make must be considered.
    if (tree.colour === "green" && !isLeaf(tree) &&  isEven(tree) ||
        tree.colour === "red"   && !isLeaf(tree) && !isEven(tree)) {
        tree.children = [findSmallestBranch(tree.children)];
    }

    tree.descendantLeaves = isLeaf(tree) ?
        1 : calculateDescendantLeaves(tree.children);
};

var getWinningWords = function (tree) {
    return {
        colour: tree.colour,
        startLetter: tree.value,
        words: getLeaves(tree)
    };
};

var printWinningWords = function (winningWords) {
    console.log("Starting with the letter " + winningWords.startLetter +
        ", player " + (winningWords.colour === "green" ? "1 " : "2 ") +
        "can force a win by working towards the following set of words:");
    // We can't just use console.log here, browser has a strop. Not sure why...
    R.forEach(function (w) { console.log(w); }, winningWords.words);
};

getDictionary("words.txt");
