import { readFile } from "fs";
import { promisify } from "util";
import { glob } from "glob";
import grayMatter from "gray-matter";

const readFilePromise = promisify(readFile);
const globPromise = promisify(glob);

// Web paths are relative to the website's index.
export const articlesWebPath = "articles";

export async function getWebPaths(pattern: string) {
	return (await getBuildPaths(pattern))
		.map((buildPath) => getWebPath(buildPath));
}

// Build paths are relative to the package root.
export const pagesBuildPath = "pages";
export const articlesBuildPath = `${pagesBuildPath}/${articlesWebPath}`;

export async function getBuildPaths(pattern: string) {
	return (await globPromise(pattern))
		.filter((path) => path.indexOf(".") >= 0);
}

export function getWebPath(buildPath: string) {
	return buildPath.slice(`${pagesBuildPath}/`.length, buildPath.lastIndexOf("."));
}

export function getFileName(path: string) {
	return path.slice(path.lastIndexOf("/"));
}

export function getSlug(fileName: string) {
	return fileName.slice(0, fileName.lastIndexOf("."));
}

export async function getFrontMatter(buildPath: string) {
	const fileContent = await readFilePromise(buildPath);
	const { data } = grayMatter(fileContent);
	return data;
}
