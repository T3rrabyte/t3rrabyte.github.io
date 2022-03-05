import "prism-themes/themes/prism-atom-dark.min.css";
import styles from "../styles/mdx-article.module.scss";

export default function MdxArticleLayout({ children }: any): JSX.Element {
  return (
    <article className={styles["mdx-article"]}>
      {children}
    </article>
  );
}
