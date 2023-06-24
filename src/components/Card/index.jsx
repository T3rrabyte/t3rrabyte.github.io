import style from "./style.module.scss";
import DynamicLink from "site/components/DynamicLink";

export default function Card({ className = "", children, href = "", ...props }) {
	return href
		? (
			<DynamicLink className={style["base"]} href={href} {...props}>
				<div className={style["content-wrapper"]} children={children} />
			</DynamicLink>
		) : (
			<div className={`${style["base"]} ${className}`} {...props}>
				<div className={style["content-wrapper"]} children={children} />
			</div>
		);
}
