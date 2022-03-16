export default function Index(): JSX.Element {
  return (
    <>
      <h1>Travis Martin</h1>
      <p>This page is currently a placeholder while I work on making it pretty.</p>
      <p>In the meantime, consider checking out these other cool websites:</p>
      <ul>
        <li><a href="https://ty.business">Ty Morrow</a></li>
        <li><a href="https://griff.pw">Griffon Hansen</a></li>
        <li><a href="https://xanycki.art">Xanycki</a></li>
      </ul>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      title: "Lakuna",
      description: "The index for Travis Martin's website."
    }
  };
}
