export default function Index(): JSX.Element {
  return (
    <>
      <h1>Travis Martin</h1>
      <p>I am Travis Martin, a junior at the University of Illinois at Chicago, currently pursuing a bachelor&apos;s degree in computer science.</p>
      <p>I have over a decade of programming experience in almost a dozen languages, and I spend much of my free time programming.</p>
      <p>This website is currently undergoing an overhaul to a new framework. In the meantime, please check out my other links:</p>
      <ul>
        <li><p><a href="https://github.com/Lakuna">GitHub</a></p></li>
        <li><p><a href="https://www.linkedin.com/in/t-j-m/">LinkedIn</a></p></li>
        <li><p><a href="mailto:tjmartin2003@gmail.com">tjmartin2003@gmail.com</a></p></li>
      </ul>
      <p>If you are looking for my WebGL tutorial series, go <a href="/webgl">here</a>.</p>
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
