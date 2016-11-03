var always = val => (_ => val);

var multimethod = () => {
	let dispatch = [];
	let deflt = undefined;

	let pred_or_eqls = matcher =>
		typeof matcher === "function"
			? matcher
			: v => v === matcher
	let fn_or_always = result =>
		typeof result === "function"
			? result
			: always(result);

	let mk_dispatch = push_method => (matcher, result) => {
		let pred = pred_or_eqls(matcher);
		let fn   = fn_or_always(result);

		dispatch[push_method]([pred, fn]);

		return out;
	};

	let out = val => {
		for (let [f, o] of dispatch) {
			if (f(val)) return o(val);
		}

		if (deflt) {
			return deflt(val);
		} else {
			throw "No match for multimethod";
		}
	};

	out.when = mk_dispatch('push');
	out.after = out.when;
	out.before = mk_dispatch('unshift');

	out.default = fn => {
		deflt = fn_or_always(fn);

		return out;
	};

	return out;
}

var match = val => {
	var method = multimethod();

	let out = {};
	out.case = (matcher, result) => {
		method.when(matcher, result);
		return out;
	};
	out.default = dflt => {
		method.default(dflt);

		if (val === undefined) {
			return method;
		} else {
			return method(val);
		}
	};
	
	return out;
};

module.exports = { multimethod, match };
