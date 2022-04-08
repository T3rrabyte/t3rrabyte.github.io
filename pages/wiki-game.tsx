import axios, { AxiosResponse } from "axios";
import { parse, HTMLElement as ParsedHTMLElement } from "node-html-parser";

// The minimum number of backlinks for a page to be eligible as the ending point.
const ENDPOINT_MIN_BACKLINKS = 100;

// The number of backlinks requested from the API. Maximum of 500.
const REQUESTED_BACKLINKS = 500;

// The base URL for the Wikipedia API.
const API_BASE_URL = "https://en.wikipedia.org/w/api.php";

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
          if (queryParameters.get("e")) {
            endingPoint = queryParameters.get("e") as string;
          } else {
            // Calculate the minimum number of backlinks for a page to be eligible as an ending point.
            const requestedEndpointBacklinks: number = Math.min(
              queryParameters.get("d")
                ? parseInt(queryParameters.get("d") ?? "") || ENDPOINT_MIN_BACKLINKS
                : ENDPOINT_MIN_BACKLINKS,
              REQUESTED_BACKLINKS);

            // Get random pages until one is an eligible ending point.
            do {
              endingPoint = await randomWikipediaPageTitle();
              console.log(`Checking endpoint: ${endingPoint}`);
            } while (await wikipediaPageBacklinkCount(endingPoint) < requestedEndpointBacklinks);
          }
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
  console.log(`Taking turn: ${clickedTitle}`);
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
    const challengeLink = `/wiki-game?s=${startingPoint.replace(/ /g, "+")}&e=${endingPoint.replace(/ /g, "+")}`;
    challengeLinkDisplay.innerHTML = `Use this link to challenge your friends: <a href=${challengeLink}>Challenge link</a>`;
  }
}

async function randomWikipediaPageTitle(): Promise<string> {
  return await axios.get(API_BASE_URL, {
    params: {
      action: "query",
      format: "json",
      origin: "*",
      list: "random",
      rnnamespace: 0
    }
  })
    .then((response: AxiosResponse): string => response.data.query.random[0].title)
    .catch((error: Error): never => { throw error; });
}

// Returns the number of backlinks for the Wikipedia page with the given title.
async function wikipediaPageBacklinkCount(title: string): Promise<number> {
  return await axios.get(API_BASE_URL, {
    params: {
      action: "query",
      format: "json",
      origin: "*",
      list: "backlinks",
      bltitle: title,
      blnamespace: 0,
      bllimit: REQUESTED_BACKLINKS
    }
  })
    .then((response: AxiosResponse): number => response.data?.query?.backlinks?.length ?? 0)
    .catch((error: Error): never => { throw error; });
}

// Get the HTML of the content of the Wikipedia page with the given title.
async function wikipediaPageContentHtml(title: string): Promise<string> {
  return await axios.get(API_BASE_URL, {
    params: {
      action: "parse",
      format: "json",
      origin: "*",
      page: title,
      prop: "text"
    }
  })
    .then((response: AxiosResponse): string => response.data.parse.text["*"])
    .catch((error: Error): never => { throw error; });
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
