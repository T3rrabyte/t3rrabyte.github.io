import axios, { AxiosResponse } from "axios";
import { parse, HTMLElement as ParsedHTMLElement } from "node-html-parser";

let currentScore: number;
let currentPage: string;
let startingPoint: string;
let endingPoint: string;

export default function WikiGame(): JSX.Element {
  if (typeof window != "undefined") {
    window.addEventListener("hashchange", () => takeTurn(window.location.hash.substring(1)));
  }

  return (
    <>
      <h1>Wiki Game</h1>
      <button
        type="button"
        onClick={async (): Promise<void> => {
          const queryParameters: URLSearchParams = new URLSearchParams(window.location.search);

          currentScore = -1;

          startingPoint = queryParameters.get("s") ?? await randomWikipediaPageTitle();
          endingPoint = queryParameters.get("e") ?? await randomWikipediaPageTitle();
          updateEndpointDisplay();

          takeTurn(startingPoint);
        }}
      >
        Start new game
      </button>
      <p id="score-display"></p>
      <p id="endpoint-display"></p>
      <p id="challenge-link-display"></p>
      <hr/>
      <div id="play-area" />
    </>
  );
}

// Updates score (and score display), checks for a victory, and displays the next page.
function takeTurn(clickedTitle: string): void {
  if (currentPage == clickedTitle) { return; }
  currentScore++;
  currentPage = clickedTitle;
  updateScoreDisplay();
  displayWikipediaPage(clickedTitle);
}

// Displays the Wikipedia page with the given title in the given play area.
async function displayWikipediaPage(title: string): Promise<void> {
  const playArea: Element | null = window.document.querySelector("div#play-area");
  if (playArea) { playArea.innerHTML = cleanParsedHtml(parse(await wikipediaPageContentHtml(title))).toString(); }
}

const nonAlphaNumeric = /[^a-z0-9]/gi;

// Updates the score display.
function updateScoreDisplay(): void {
  const scoreDisplay: Element | null = window.document.querySelector("p#score-display");

  if (scoreDisplay) {
    scoreDisplay.innerHTML =
      currentPage.replace(nonAlphaNumeric, "") == endingPoint.replace(nonAlphaNumeric, "")
      ? `Achieved victory in ${currentScore} turns.`
      : `Turns taken: ${currentScore}`;
  }
}

// Updates the endpoint display.
function updateEndpointDisplay(): void {
  const endpointDisplay: Element | null = window.document.querySelector("p#endpoint-display");
  if (endpointDisplay) { endpointDisplay.innerHTML = `Current goal: "${startingPoint}" to "${endingPoint}"`; }

  // Update the challenge link display.
  const challengeLinkDisplay: Element | null = window.document.querySelector("p#challenge-link-display");
  if (challengeLinkDisplay) {
    const challengeLink = `https://lakuna.pw/wiki-game?s=${startingPoint.replace(/ /g, "+")}&e=${endingPoint.replace(/ /g, "+")}`;
    challengeLinkDisplay.innerHTML = `Use this link to challenge your friends: <a href=${challengeLink}>${challengeLink}</a>`;
  }
}

async function randomWikipediaPageTitle(): Promise<string> {
  return await axios.get("https://en.wikipedia.org/w/api.php", {
    params: {
      action: "query",
      format: "json",
      origin: "*",
      list: "random",
      rnnamespace: 0
    }
  })
    .then((response: AxiosResponse): string => response.data.query.random[0].title)
    .catch((error: Error): void => { throw error; }) as string;
}

// Get the HTML of the content of the Wikipedia page with the given title.
async function wikipediaPageContentHtml(title: string): Promise<string> {
  return await axios.get(`https://en.wikipedia.org/w/api.php`, {
    params: {
      action: "parse",
      format: "json",
      origin: "*",
      page: title,
      prop: "text"
    }
  })
    .then((response: AxiosResponse): string => response.data.parse.text["*"])
    .catch((error: Error): void => { throw error; }) as string;
}

// Recursively replace links in the given parsed HTML with function calls, and delete added styles.
function cleanParsedHtml(parsedHtml: ParsedHTMLElement): ParsedHTMLElement {
  // Remove all children of style tags.
  if (parsedHtml.tagName?.toLowerCase() == "style") {
    parsedHtml.remove();
  }

  // Remove style attributes.
  parsedHtml.removeAttribute?.("style");

  // Modify href attributes.
  if (parsedHtml.hasAttribute?.("href")) {
    if (parsedHtml.getAttribute?.("href")?.startsWith("/wiki/")) {
      parsedHtml.setAttribute?.("href", `#${parsedHtml.getAttribute?.("href")?.substring("/wiki/".length)}`);
    } else {
      parsedHtml.removeAttribute?.("href");
    }
  }

  for (const child of parsedHtml.childNodes) {
    parsedHtml.exchangeChild?.(child, cleanParsedHtml(child as ParsedHTMLElement));
  }

  return parsedHtml;
}

export async function getStaticProps() {
  return {
    props: {
      title: "Wiki Game",
      description: "A hypertextual game designed to work specifically with Wikipedia."
    }
  };
}
