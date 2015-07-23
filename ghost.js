// depends on 'helpers.js'

// First we get the dictionary from the path specified at the bottom of the
// file. Nothing very interesting happens in this function.
var getDictionary = function (path) {
    var client = new XMLHttpRequest(),
        that = this;
    client.open('GET', path);
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
    var prefixes, tree;

    console.log('processing dictionary...');
    dictionary = processDictionary(dictionary);

    console.log('populating prefixes...');
    prefixes = populatePrefixes(dictionary);

    console.log('building tree...');
    tree = buildTree(prefixes);

    // vertices red or green

    // split in to 26 monochromatic tries

    // prune each tree dependent on colour

    // output leaves
}

// Delete all words of length <=2 and all unreachable words.
var processDictionary = function (dictionary) {
    dictionary = dictionary.filter(function (w) { return w.length > 2; });
    // This needs to be done in two filters because we don't want to include
    // those words we kulled above in the second comparison.
    dictionary = dictionary.filter(function (p) {
        return !dictionary.some(function (q) { q.isPrefixOf(p) });
    });
    return dictionary;
};

// Returns an array of all the prefixes of all the words in our dictionary.
var populatePrefixes = function (dictionary) {
    return dictionary
        .map(function (w) { return w.prefixes(); })
        .flatten()
        .uniq()
        .sortBy(function (s) { return s.length; });
}

// Builds the whole tree from prefixes, rather than just one vertex like the
// constructor below.
var buildTree = function (prefixes) {
    var tree = constructTree('');
    prefixes.each(function (p) { tree.insert(p); });
    return tree;
}

// Constructs a tree with the specified value and empty children, both private.
var constructTree = function (value) {
    var children = [],
        colour = 'none';
    return {
        getChildren: function () { return children; },
        getColour: function () { return colour; },
        getValue: function () { return value; },

        // The insert method places a string in the tree at a vertex whose value
        // is a prefix of it, and precicely one character shorter. The resulting
        // tree is in fact a 'trie' (see wikipedia.org/trie).
        // Note also that the order in which we add our strings matters. We must
        // add from shortest to longest.
        insert: function (newValue) {
            if (value.length = newValue.length + 1) {
                children.push(constructTree(newValue));
            }
            else {
                children
                    .find(function (t) {
                        return t.getValue().isPrefixOf(newValue); })
                    .insert(newValue);
            }
        },

        calculateColours: function () {

        }
    };
}

getDictionary('/words.txt');
