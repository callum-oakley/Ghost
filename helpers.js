// depends on underscore.js
// lots of the following definitions simply translate underscore functions to
// augmented methods because the author prefers the syntax and would like to
// pretend that these methods were built in to js...

// allows us to augment methods on built in types
Function.prototype.method = function (name, func) {
    this.prototype[name] = func;
};

// x.isPrefixOf(y) asks "is x a prefix of y?"
String.method('isPrefixOf', function (other) {
    return this.indexOf(other) === 0;
});

// returns a list of the prefixes of a given string
String.method('prefixes', function () {
    var that = this;
    return _.range(1, that.length + 1).map(function (i) {
        return that.slice(0, i);
    });
});

// partial application method
Function.method('curry', function () {
    var slice = Array.prototype.slice,
        args = slice.apply(arguments),
        that = this;
    return function () {
        return that.apply(null, args.concat(slice.apply(arguments)));
    };
});

// get integer part method
Number.method('integer', function () {
    return Math[this < 0 ? 'ceil' : 'floor'](this);
});

// memoize a recursive function on natural numbers
var memoizer = function (memo, fundamental) {
    var shell = function (n) {
        var result = memo[n];
        if (typeof result !== 'number') {
            result = fundamental(shell, n);
            memo[n] = result;
        }
        return result;
    }
    return shell;
};

// translations of underscore.js functions below this line. Some of these
// are untested... have fun! :P

// collection methods

Object.method('each', function () {
    return _.each.curry(this).apply(null, arguments);
});

Object.method('map', function () {
    return _.map.curry(this).apply(null, arguments);
});

Object.method('reduce', function () {
    return _.reduce.curry(this).apply(null, arguments);
});

Object.method('reduceRight', function () {
    return _.reduceRight.curry(this).apply(null, arguments);
});

Object.method('find', function () {
    return _.find.curry(this).apply(null, arguments);
});

Object.method('filter', function () {
    return _.filter.curry(this).apply(null, arguments);
});

Object.method('where', function () {
    return _.where.curry(this).apply(null, arguments);
});

Object.method('findWhere', function () {
    return _.findWhere.curry(this).apply(null, arguments);
});

Object.method('reject', function () {
    return _.reject.curry(this).apply(null, arguments);
});

Object.method('every', function () {
    return _.every.curry(this).apply(null, arguments);
});

Object.method('some', function () {
    return _.some.curry(this).apply(null, arguments);
});

Object.method('contains', function () {
    return _.contains.curry(this).apply(null, arguments);
});

Object.method('invoke', function () {
    return _.invoke.curry(this).apply(null, arguments);
});

Object.method('pluck', function () {
    return _.pluck.curry(this).apply(null, arguments);
});

Object.method('max', function () {
    return _.max.curry(this).apply(null, arguments);
});

Object.method('min', function () {
    return _.min.curry(this).apply(null, arguments);
});

Object.method('sortBy', function () {
    return _.sortBy.curry(this).apply(null, arguments);
});

Object.method('groupBy', function () {
    return _.groupBy.curry(this).apply(null, arguments);
});

Object.method('indexBy', function () {
    return _.indexBy.curry(this).apply(null, arguments);
});

Object.method('countBy', function () {
    return _.countBy.curry(this).apply(null, arguments);
});

Object.method('shuffle', function () {
    return _.shuffle.curry(this).apply(null, arguments);
});

Object.method('sample', function () {
    return _.sample.curry(this).apply(null, arguments);
});

Object.method('toArray', function () {
    return _.toArray.curry(this).apply(null, arguments);
});

Object.method('size', function () {
    return _.size.curry(this).apply(null, arguments);
});

Object.method('partition', function () {
    return _.partition.curry(this).apply(null, arguments);
});


// array methods

Array.method('first', function () {
    return _.first.curry(this).apply(null, arguments);
});

Array.method('initial', function () {
    return _.initial.curry(this).apply(null, arguments);
});

Array.method('last', function () {
    return _.last.curry(this).apply(null, arguments);
});

Array.method('rest', function () {
    return _.rest.curry(this).apply(null, arguments);
});

Array.method('compact', function () {
    return _.compact.curry(this).apply(null, arguments);
});

Array.method('flatten', function () {
    return _.flatten.curry(this).apply(null, arguments);
});

Array.method('without', function () {
    return _.without.curry(this).apply(null, arguments);
});

Array.method('union', function () {
    return _.union.curry(this).apply(null, arguments);
});

Array.method('intersection', function () {
    return _.intersection.curry(this).apply(null, arguments);
});

Array.method('difference', function () {
    return _.difference.curry(this).apply(null, arguments);
});

Array.method('uniq', function () {
    return _.uniq.curry(this).apply(null, arguments);
});

Array.method('zip', function () {
    return _.zip.curry(this).apply(null, arguments);
});

Array.method('unzip', function () {
    return _.unzip.curry(this).apply(null, arguments);
});

Array.method('object', function () {
    return _.object.curry(this).apply(null, arguments);
});

Array.method('indexOf', function () {
    return _.indexOf.curry(this).apply(null, arguments);
});

Array.method('lastIndexOf', function () {
    return _.lastIndexOf.curry(this).apply(null, arguments);
});

Array.method('sortedIndex', function () {
    return _.sortedIndex.curry(this).apply(null, arguments);
});

Array.method('findIndex', function () {
    return _.findIndex.curry(this).apply(null, arguments);
});

Array.method('findLastIndex', function () {
    return _.findLastIndex.curry(this).apply(null, arguments);
});

// also make the range function global because it's the author's fav.
var range = _.range;
