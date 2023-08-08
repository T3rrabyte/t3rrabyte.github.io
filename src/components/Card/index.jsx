import style from "./style.module.scss";
import DynamicLink from "#DynamicLink";

export default ({ className = "", children, href = "", ...props }) => href
	? (
		<DynamicLink className={style["base"]} href={href} {...props}>
			<div className={style["content-wrapper"]} children={children} />
		</DynamicLink>
	) : (
		<div className={`${style["base"]} ${className}`} {...props}>
			<div className={style["content-wrapper"]} children={children} />
		</div>
	);
