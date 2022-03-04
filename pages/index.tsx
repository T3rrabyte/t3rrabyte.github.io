export default function Index(): JSX.Element {
  return <h1>Placeholder.</h1>
}

export async function getStaticProps() {
  return {
    props: {
      title: "Lakuna",
      description: "The index for Travis Martin's website."
    }
  };
}
