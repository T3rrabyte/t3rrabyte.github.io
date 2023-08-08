"use client";

import style from "./style.module.scss";
import { useEffect, useState } from "react";
import { hypergeometricPmf, summation } from "@lakuna/umath";

const onChange = (setter) => {
	return (event) => {
		setter(parseInt(event.target.value));
	};
};

export default (props) => {
	const [N, setN] = useState(60);
	const [K, setK] = useState(4);
	const [n, setn] = useState(7);
	const [k, setk] = useState(1);

	const [e, sete] = useState(0);
	const [lt, setlt] = useState(0);
	const [gt, setgt] = useState(0);

	useEffect(() => {
		const eOut = hypergeometricPmf(N, K, n, k);
		const ltOut = summation(0, k - 1, (k) => hypergeometricPmf(N, K, n, k));
		const gtOut = summation(k + 1, K, (k) => hypergeometricPmf(N, K, n, k));

		sete(eOut);
		setlt(ltOut);
		setgt(gtOut);
	}, [N, K, n, k]);

	return <form className={style["base"]} {...props}>
		<label htmlFor="N">Cards in deck:</label>
		<input type="number" id="N" name="N" value={N} onChange={onChange(setN)} />
		<label htmlFor="K">Copies of [card] in deck:</label>
		<input type="number" id="K" name="K" value={K} onChange={onChange(setK)} />
		<label htmlFor="n">Cards drawn:</label>
		<input type="number" id="n" name="n" value={n} onChange={onChange(setn)} />
		<label htmlFor="k">Preferred copies of [card] drawn:</label>
		<input type="number" id="k" name="k" value={k} onChange={onChange(setk)} />
		<label htmlFor="e">Chance to draw exactly {k} [card]s:</label>
		<output id="e" name="e">{`~${(e * 100).toFixed(2)}%`}</output>
		<label htmlFor="lt">Chance to draw less than {k} [card]s:</label>
		<output id="lt" name="lt">{`~${(lt * 100).toFixed(2)}%`}</output>
		<label htmlFor="gt">Chance to draw more than {k} [card]s:</label>
		<output id="gt" name="gt">{`~${(gt * 100).toFixed(2)}%`}</output>
	</form>;
};
