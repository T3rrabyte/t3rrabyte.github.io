import Link, { type LinkProps } from "#Link";
import style from "./button-link.module.scss";

export default function ButtonLink(props: LinkProps) {
	const { className, ...restProps } =
		"className" in props ? props : { className: void 0, ...props };
	const buttonLinkClassName = style["button-link"];
	const fullClassName = buttonLinkClassName
		? className
			? `${buttonLinkClassName} ${className}`
			: buttonLinkClassName
		: className;

	return <Link className={fullClassName} {...restProps} />;
}
