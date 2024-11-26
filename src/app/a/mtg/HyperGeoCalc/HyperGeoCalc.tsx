"use client";

import {
	type ChangeEvent,
	type Dispatch,
	type SetStateAction,
	useEffect,
	useState
} from "react";
import { hypergeometricPmf, summation } from "@lakuna/umath";
import type { Props } from "#Props";
import style from "./hyper-geo-calc.module.scss";

const onChange =
	(setter: Dispatch<SetStateAction<number>>) =>
	(event: ChangeEvent<HTMLInputElement>) => {
		setter(parseInt(event.target.value, 10) || 0);
	};

export default function HyperGeoCalc({
	className,
	...props
}: Props<HTMLFormElement>) {
	const hyperGeoCalcClassName = style["hyper-geo-calc"];

	const fullClassName = hyperGeoCalcClassName
		? className
			? `${hyperGeoCalcClassName} ${className}`
			: hyperGeoCalcClassName
		: className;

	const [N, setN] = useState(60);
	const [K, setK] = useState(4);
	const [n, setn] = useState(7);
	const [k, setk] = useState(1);

	const [e, sete] = useState(0);
	const [lt, setlt] = useState(0);
	const [gt, setgt] = useState(0);

	const effectCallback = () => {
		const eOut = hypergeometricPmf(N, K, n, k);
		const ltOut = summation(0, k - 1, (k2) => hypergeometricPmf(N, K, n, k2));
		const gtOut = summation(k + 1, K, (k2) => hypergeometricPmf(N, K, n, k2));

		sete(eOut);
		setlt(ltOut);
		setgt(gtOut);
	};

	useEffect(effectCallback, [N, K, n, k]);

	return (
		<form className={fullClassName} {...props}>
			<label htmlFor="N">{"Cards in deck:"}</label>
			<input
				type="number"
				id="N"
				name="N"
				value={N}
				onChange={onChange(setN)}
			/>
			<label htmlFor="K">{"Copies of [card] in deck:"}</label>
			<input
				type="number"
				id="K"
				name="K"
				value={K}
				onChange={onChange(setK)}
			/>
			<label htmlFor="n">{"Cards drawn:"}</label>
			<input
				type="number"
				id="n"
				name="n"
				value={n}
				onChange={onChange(setn)}
			/>
			<label htmlFor="k">{"Preferred copies of [card] drawn:"}</label>
			<input
				type="number"
				id="k"
				name="k"
				value={k}
				onChange={onChange(setk)}
			/>
			<label htmlFor="lt">
				{"Chance to draw less than "}
				{k}
				{" [card]s:"}
			</label>
			<output id="lt" name="lt">{`~${(lt * 100).toFixed(2)}%`}</output>
			<label htmlFor="lte">
				{"Chance to draw at most "}
				{k}
				{" [card]s:"}
			</label>
			<output id="lte" name="lte">{`~${((lt + e) * 100).toFixed(2)}%`}</output>
			<label htmlFor="e">
				{"Chance to draw exactly "}
				{k}
				{" [card]s:"}
			</label>
			<output id="e" name="e">{`~${(e * 100).toFixed(2)}%`}</output>
			<label htmlFor="gte">
				{"Chance to draw at least "}
				{k}
				{" [card]s:"}
			</label>
			<output id="gte" name="gte">{`~${((gt + e) * 100).toFixed(2)}%`}</output>
			<label htmlFor="gt">
				{"Chance to draw more than "}
				{k}
				{" [card]s:"}
			</label>
			<output id="gt" name="gt">{`~${(gt * 100).toFixed(2)}%`}</output>
		</form>
	);
}
