import { readFile } from "fs";
import { promisify } from "util";
import glob from "glob";
import { pagesBuildPath } from "./constants.js";
import grayMatter from "gray-matter";

const readFilePromise = promisify(readFile);
const globPromise = promisify(glob);

export async function getWebPaths(pattern) {
	return (await getBuildPaths(pattern))
		.map((buildPath) => getWebPath(buildPath));
}

export async function getBuildPaths(pattern) {
	return (await globPromise(pattern))
		.filter((path) => path.indexOf(".") >= 0);
}

export function getWebPath(buildPath) {
	return buildPath.slice(`${pagesBuildPath}/`.length, buildPath.lastIndexOf("."));
}

export function getFileName(path) {
	return path.slice(path.lastIndexOf("/"));
}

export function getSlug(fileName) {
	return fileName.slice(0, fileName.lastIndexOf("."));
}

export async function getFrontMatter(buildPath) {
	const fileContent = await readFilePromise(buildPath);
	const { data } = grayMatter(fileContent);
	return data;
}
