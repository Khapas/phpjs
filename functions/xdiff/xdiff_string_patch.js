function xdiff_string_patch (originalStr, patch, flags, error) {
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brett-zamir.me)
    // %        note 1: The XDIFF_PATCH_IGNORESPACE flag and the error argument are not currently supported
    // %        note 1: This has not been widely tested
    // *     example 1: xdiff_string_patch ('', '@@ -0,0 +1,1 @@\n+Hello world!');
    // *     returns 1: 'Hello world!'

    var i = 0, ll = 0, ranges = [], lastLinePos = 0, firstChar = '',
        rangeExp = /^@@\s+-(\d+),(\d+)\s+\+(\d+),(\d+)\s+@@$/,
        lineBreaks = /\r?\n/,
        lines = patch.split(lineBreaks),
        origLines = originalStr.split(lineBreaks),
        newStrArr = [],
        linePos = 0,
		errors = '',
        // Both string & integer (constant) input is allowed
        optTemp = 0,
		OPTS = { // Unsure of actual PHP values, so better to rely on string
			'XDIFF_PATCH_NORMAL': 1,
			'XDIFF_PATCH_REVERSE': 2,
			'XDIFF_PATCH_IGNORESPACE': 4
        };

    // Input defaulting & sanitation
    if (typeof originalStr !== 'string' || !patch) {return false;}
    if (!flags) {flags = 'XDIFF_PATCH_NORMAL';}

    if (typeof flags !== 'number') { // Allow for a single string or an array of string flags
        flags = [].concat(flags);
        for (i=0; i < flags.length; i++) {
            // Resolve string input to bitwise e.g. 'XDIFF_PATCH_NORMAL' becomes 1
            if (OPTS[flags[i]]) {
                optTemp = optTemp | OPTS[flags[i]];
            }
        }
        flags = optTemp;
    }

	if (flags & OPTS.XDIFF_PATCH_NORMAL) {
		for (i=0, ll = lines.length; i < ll; i++) {
			ranges = lines[i].match(rangeExp);
			if (ranges) {
				lastLinePos = linePos;
				linePos = ranges[1] - 1;
				while (lastLinePos < linePos) {
					newStrArr[newStrArr.length] = origLines[lastLinePos++];
				}
				while (lines[++i] && (rangeExp.exec(lines[i])) == null) {
					firstChar = lines[i].charAt(0);
					switch (firstChar) {
						case '-':
							++linePos; // Skip including that line
							break;
						case '+':
							newStrArr[newStrArr.length] = lines[i].slice(1);
							break;
						case ' ':
							newStrArr[newStrArr.length] = origLines[linePos++];
							break;
						default:
							throw 'Unrecognized initial character in unidiff line'; // Reconcile with returning errrors arg?
					}
				}
				if (lines[i]) { i--; }
			}
		}
    }
	else if (flags & OPTS.XDIFF_PATCH_REVERSE) {
	    for (i=0, ll = lines.length; i < ll; i++) {
			ranges = lines[i].match(rangeExp);
			if (ranges) {
				lastLinePos = linePos;
				linePos = ranges[3] - 1;
				while (lastLinePos < linePos) {
					newStrArr[newStrArr.length] = origLines[lastLinePos++];
				}
				while (lines[++i] && (rangeExp.exec(lines[i])) == null) {
					firstChar = lines[i].charAt(0);
					switch (firstChar) {
						case '-':
							newStrArr[newStrArr.length] = lines[i].slice(1);
							break;
						case '+':
							++linePos; // Skip including that line
							break;
						case ' ':
							newStrArr[newStrArr.length] = origLines[linePos++];
							break;
						default:
							throw 'Unrecognized initial character in unidiff line'; // Reconcile with returning errrors arg?
					}
				}
				if (lines[i]) { i--; }
			}
		}
	}
	if (typeof (error === 'string')) {
		this.window[error] = errors;
	}
	return newStrArr.join('\n');
}