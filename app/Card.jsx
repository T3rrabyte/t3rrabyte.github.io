import style from "./card.module.scss";
import Link from "next/link";

export default function Card({ className = "", children, href = "", ...props }) {
	return href
		? (
			<Link className={style["base"]} href={href} {...props}>
				<div className={style["content-wrapper"]} children={children} />
			</Link>
		) : (
			<div className={`${style["base"]} ${className}`} {...props}>
				<div className={style["content-wrapper"]} children={children} />
			</div>
		);
}
