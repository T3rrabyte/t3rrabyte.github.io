import Link, { type LinkProps } from "../Link";
import style from "./button-link.module.scss";

export default function ButtonLink({ className, ...props }: LinkProps) {
	const buttonLinkClassName = style["button-link"];

	const fullClassName = buttonLinkClassName
		? className
			? `${buttonLinkClassName} ${className}`
			: buttonLinkClassName
		: className;

	return <Link className={fullClassName} {...props} />;
}
