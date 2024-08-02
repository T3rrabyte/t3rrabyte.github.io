"use client";

import { useEffect, useState } from "react";
import Link from "#Link";
import type { Props } from "#Props";
import style from "./one-liner.module.scss";

const oneLiners = [
	// Initial value. Cannot be chosen.
	<span key={-1}>{"Loading..."}</span>,

	// One-liners.
	<span key={0}>
		{"Also check out "}
		<Link href="https://griff.pw/">{"griff.pw"}</Link>
		{"!"}
	</span>,
	<span key={1}>
		{"Also check out "}
		<Link href="https://ty.business/">{"ty.business"}</Link>
		{"!"}
	</span>,
	<span key={3}>{"All your base are belong to us."}</span>,
	<code key={4}>{"// evil floating point bit level hacking"}</code>,
	<span key={5}>{"There's a frood who really knows where his towel is."}</span>,
	<span key={6}>{"So Long, and Thanks for All the Fish."}</span>,
	<span key={9}>{"Rich Purnell is a steely-eyed missile man!"}</span>,
	<span key={10}>{"Death awaits you all with big, nasty, pointy teeth!"}</span>,
	<span key={11}>{"What was, shall be. What shall be, was."}</span>,
	<span key={13}>{"It's dangerous to go alone!"}</span>,
	<span key={14}>{"˄ ˄ ˅ ˅ ˂ ˃ ˂ ˃ B A S"}</span>,
	<span key={15}>
		{"You are in a maze of twisty little passages, all alike."}
	</span>,
	<span key={16}>{"Xyzzy"}</span>,
	<code key={17}>{"Segmentation fault (core dumped)"}</code>,
	<span key={18}>{"Live long and prosper."}</span>,
	<span key={19}>{"Blood for the blood god."}</span>,
	<span key={20}>{"Hey, you - you're finally awake."}</span>,
	<span key={21}>{"You must construct additional pylons."}</span>,
	<span key={22}>{"LEEEEEROOOOYY JEEENNNNKIIINSS!"}</span>,
	<span key={23}>{"Cogito, ergo sum."}</span>,
	<span key={25}>{"Oh? You're approaching me?"}</span>,
	<span key={26}>{"The cake is a lie."}</span>,
	<span key={27}>{"Are you not entertained?"}</span>,
	<span key={28}>{"Snakes. Why did it have to be snakes?"}</span>,
	<span key={29}>{"I solemnly swear that I am up to no good."}</span>,
	<span key={30}>{"There is no spoon."}</span>,
	<span key={35}>{"Have fun storming the castle!"}</span>,
	<span key={36}>{"Houston, we have a problem."}</span>,
	<span key={38}>{"I've got a bad feeling about this..."}</span>,
	<span key={39}>{"May the Force be with you."}</span>,
	<span key={30}>{"May the Shwartz be with you."}</span>,
	<span key={41}>{"If you can dodge a wrench, you can dodge a ball."}</span>,
	<span key={42}>{"Open the pod bay doors, HAL."}</span>,
	<span key={44}>
		<Link href="https://discord.gg/sdcleague">{"SDC"}</Link>
		{" champion."}
	</span>,
	<span key={45}>{"Time favors the Thallids."}</span>,
	<code key={48}>{":(){ :|:&};:"}</code>,
	<span key={49}>{"Excelsior!"}</span>,
	<span key={51}>{"El Psy Kongroo"}</span>,
	<span key={53}>{"God drinks Java."}</span>,
	<span key={54}>{"SEE YOU SPACE COWBOY..."}</span>,
	<span key={55}>{"Dodge, duck, dip, dive, and dodge."}</span>,
	<span key={64}>{"Fiat justitia ruat caelum"}</span>,
	<span key={65}>{"Rip and tear, until it is done."}</span>
];

/*
 * Retired One-Liners:
 * 2. Also check out [xanycki.art](https://www.xanycki.art/)!
 * 7. Roads? Where we're going, we don't need roads!
 * 8. ♪ Trigger, killer, eye of the storm ♪
 * 12. ♪ There's blood on the crown, go and take it ♪
 * 24. I'll take a potato chip... and eat it!
 * 31. Shaken, not stirred.
 * 32. Come with me if you want to live.
 * 33. ♪ Maybe it's a dream, maybe nothing else is real ♪
 * 34. Elementary, my dear Watson.
 * 37. I am Groot.
 * 43. ♪ A little bit of everything, all of the time ♪
 * 46. WD-40 Fan
 * 47. ♪ Another way to feel what you didn't want yourself to know ♪
 * 50. Day before yesterday I saw a rabbit, and yesterday a deer, and today, you.
 * 52. ♪ If everyone is not special, maybe you can be what you want to be ♪
 * 56. ♪ I'm always dreaming, believing "ideal" exists ♪
 * 57. ♪ My naked heart can hear echoes, echoes ♪
 * 58. ♪ I turn the page to drown you out ♪
 * 59. you cannot kill me in a way that matters
 * 60. There can be only one.
 * 61. ♪ Greed is unlimited; freedom is a limited resource ♪
 * 62. ♪ Some little ironies called tragedies so silently ♪
 * 63. ♪ The course of action is merely a by-product of my focus ♪
 */

export default function OneLiner({
	className,
	...props
}: Props<HTMLParagraphElement>) {
	const oneLinerClassName = style["one-liner"];

	const fullClassName =
		typeof oneLinerClassName === "undefined"
			? className
			: typeof className === "undefined"
				? oneLinerClassName
				: `${oneLinerClassName} ${className}`;

	const [i, setI] = useState(0);

	const effectCallback = () => {
		// Minimum value of `1` so that the "Loading..." text doesn't get chosen.
		setI(Math.floor(Math.random() * (oneLiners.length - 1) + 1));
	};

	useEffect(effectCallback, []);

	return (
		<p className={fullClassName} {...props}>
			{oneLiners[i]}
		</p>
	);
}
