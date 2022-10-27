import { ChangeEvent, useEffect, useState } from "react";
import styles from "../styles/hypergeocalc.module.scss";

function factorial(n: number): number {
	return n < 0 || Number.isNaN(n)
		? NaN
		: n <= 1
			? 1
			: n * factorial(n - 1);
}

function combinations(n: number, r: number): number {
	return Number.isNaN(n) || Number.isNaN(r)
		? NaN
		: factorial(n) / (factorial(r) * factorial(n - r));
}

function pmf(N: number, K: number, n: number, k: number): number {
	return Number.isNaN(N) || Number.isNaN(K) || Number.isNaN(n) || Number.isNaN(k)
		? NaN
		: (combinations(K, k) * combinations(N - K, n - k)) / combinations(N, n);
}

function summation(min: number, max: number, expression: (i: number) => number, output = 0): typeof output {
	if (Number.isNaN(min) || Number.isNaN(max) || Number.isNaN(output)) { return NaN; }
	let out = 0;
	for (let i = min; i <= max; i++) {
		const expI = expression(i);
		if (Number.isNaN(expI)) { break; } // Just approximate the answer if JavaScript isn't good enough.
		out += expI;
	}
	return out;
}

function onChange(setter: (value: number) => void): (event: ChangeEvent<HTMLInputElement>) => void {
	return function doSetter(event: ChangeEvent<HTMLInputElement>): void {
		setter(parseInt(event.target.value));
	}
}

export default function HyperGeoCalc({
	NLabel = "Population size",
	NDefault = 0,
	KLabel = "Objects with feature",
	KDefault = 0,
	nLabel = "Number of draws",
	nDefault = 0,
	kLabel = "Number of successes",
	kDefault = 0,
	eLabel = "",
	ltLabel = "",
	lteLabel = "",
	gtLabel = "",
	gteLabel = "",
	...props
}) {
	const [N, setN] = useState(NDefault);
	const [K, setK] = useState(KDefault);
	const [n, setn] = useState(nDefault);
	const [k, setk] = useState(kDefault);
	const [e, sete] = useState(0);
	const [lt, setlt] = useState(0);
	const [lte, setlte] = useState(0);
	const [gt, setgt] = useState(0);
	const [gte, setgte] = useState(0);

	useEffect(() => {
		const eOut = pmf(N, K, n, k);
		sete(eOut);
		const ltOut = summation(0, k - 1, (k) => pmf(N, K, n, k));
		setlt(ltOut);
		setlte(ltOut + eOut);
		const gtOut = summation(k + 1, K, (k) => pmf(N, K, n, k));
		setgt(gtOut);
		setgte(gtOut + eOut);
	}, [N, K, n, k]);

	return (
		<>
			<form className={styles["hypergeocalc"]} {...props}>
				<label htmlFor="N">{`${NLabel} (N):`}</label>
				<input type="number" id="N" name="N" value={N} onChange={onChange(setN)} />
				<label htmlFor="K">{`${KLabel} (K):`}</label>
				<input type="number" id="K" name="K" value={K} onChange={onChange(setK)} />
				<label htmlFor="n">{`${nLabel} (n):`}</label>
				<input type="number" id="n" name="n" value={n} onChange={onChange(setn)} />
				<label htmlFor="k">{`${kLabel} (k):`}</label>
				<input type="number" id="k" name="k" value={k} onChange={onChange(setk)} />
				<label htmlFor="e">{`${eLabel} (X=${k}):`}</label>
				<output id="e" name="e">{`${e}`}</output>
				<label htmlFor="lt">{`${ltLabel} (X<${k}):`}</label>
				<output id="lt" name="lt">{`${lt}`}</output>
				<label htmlFor="lte">{`${lteLabel} (X≤${k}):`}</label>
				<output id="lte" name="lte">{`${lte}`}</output>
				<label htmlFor="gt">{`${gtLabel} (X>${k}):`}</label>
				<output id="gt" name="gt">{`${gt}`}</output>
				<label htmlFor="gte">{`${gteLabel} (X≥${k}):`}</label>
				<output id="gte" name="gte">{`${gte}`}</output>
			</form>
		</>
	);
}
