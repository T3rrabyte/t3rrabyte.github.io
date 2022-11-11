import style from "./card.module.scss";
import Link from "next/link";

export default function Card({ className = "", children, href = "", ...props }) {
	return (
		<div className={`${style["base"]} ${className}`} {...props}>
			{href ? (
				<Link className={style["outer-link"]} href={href}>
					<div className={style["content-wrapper"]} children={children} />
				</Link>
			) : (
				<div className={style["content-wrapper"]} children={children} />
			)}
		</div>
	);
}
