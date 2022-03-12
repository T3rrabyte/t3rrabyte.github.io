import "prism-themes/themes/prism-atom-dark.min.css";
import styles from "../styles/mdx-article.module.scss";
import { ReactChild } from "react";

type Properties = {
  children: ReactChild[]
}

export default function MdxArticleLayout({ children }: Properties): JSX.Element {
  return (
    <article className={styles["mdx-article"]}>
      {children}
    </article>
  );
}
