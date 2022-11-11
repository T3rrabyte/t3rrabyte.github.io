"use client";

import style from "./hypergeometric-calculator.module.scss";
import { ChangeEvent, useEffect, useState } from "react";

function factorial(n) {
	return n < 0 || Number.isNaN(n)
		? NaN
		: n <= 1
			? 1
			: n * factorial(n - 1);
}

function combinations(n, r) {
	return Number.isNaN(n) || Number.isNaN(r)
		? NaN
		: factorial(n) / (factorial(r) * factorial(n - r));
}

function probabilityMassFunction(N, K, n, k) {
	return Number.isNaN(N) || Number.isNaN(K) || Number.isNaN(n) || Number.isNaN(k)
		? NaN
		: (combinations(K, k) * combinations(N - K, n - k)) / combinations(N, n);
}

function summation(min, max, expression, output = 0) {
	if (Number.isNaN(min) || Number.isNaN(max) || Number.isNaN(output)) {
		return NaN;
	}

	let out = 0;
	for (let i = min; i <= max; i++) {
		const expI = expression(i);
		if (Number.isNaN(expI)) { break; }
		out += expI;
	}

	return out;
}

function onChange(setter) {
	return function doSetter(event) {
		setter(parseInt(event.target.value));
	}
}

export default function HypergeometricCalculator(props) {
	const [N, setN] = useState(60);
	const [K, setK] = useState(4);
	const [n, setn] = useState(7);
	const [k, setk] = useState(1);

	const [e, sete] = useState(0);
	const [lt, setlt] = useState(0);
	const [gt, setgt] = useState(0);

	useEffect(() => {
		const eOut = probabilityMassFunction(N, K, n, k);
		const ltOut = summation(0, k - 1, (k) => probabilityMassFunction(N, K, n, k));
		const gtOut = summation(k + 1, K, (k) => probabilityMassFunction(N, K, n, k));

		sete(eOut);
		setlt(ltOut);
		setgt(gtOut);
	}, [N, K, n, k]);

	return (
		<form className={style["base"]} {...props}>
			<label htmlFor="N">Cards in deck (N):</label>
			<input type="number" id="N" name="N" value={N} onChange={onChange(setN)} />
			<label htmlFor="K">Copies of [card] in deck (K):</label>
			<input type="number" id="K" name="K" value={K} onChange={onChange(setK)} />
			<label htmlFor="n">Cards drawn (n):</label>
			<input type="number" id="n" name="n" value={n} onChange={onChange(setn)} />
			<label htmlFor="k">Preferred copies of [card] drawn (k):</label>
			<input type="number" id="k" name="k" value={k} onChange={onChange(setk)} />
			<label htmlFor="e">Chance to draw exactly {k} [card]s:</label>
			<output id="e" name="e">{e}</output>
			<label htmlFor="lt">Chance to draw less than {k} [card]s:</label>
			<output id="lt" name="lt">{lt}</output>
			<label htmlFor="gt">Chance to draw more than {k} [card]s:</label>
			<output id="gt" name="gt">{gt}</output>
		</form>
	);
}
