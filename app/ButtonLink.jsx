import Link from "next/link";
import style from "./button-link.module.scss";

export default function ButtonLink({ className = "", ...props }) {
	return <Link className={`${style["base"]} ${className}`} {...props} />;
}
