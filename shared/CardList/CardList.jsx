import style from "./card-list.module.scss";

export default function CardList({ className = "", ...props }) {
	return <div className={`${style["base"]} ${className}`} {...props} />;
}
