import { useState, useEffect } from "react";
import Link from "next/link";

const oneliners = [
	<span>Also check out <Link href="https://griff.pw/"><a>griff.pw</a></Link>!</span>,
	<span>Also check out <Link href="https://ty.business/"><a>ty.business</a></Link>!</span>,
	<span>Also check out <Link href="https://www.xanycki.art/"><a>xanycki.art</a></Link>!</span>,
	<span>All your base are belong to us.</span>,
	<code>// evil floating point bit level hacking</code>,
	<span>There's a frood who really knows where his towel is.</span>,
	<span>So Long, and Thanks for All the Fish.</span>,
	<span>Roads? Where we're going, we don't need roads!</span>,
	<span>Trigger, killer, eye of the storm.</span>,
	<span>Rich Purnell is a steely-eyed missile man!</span>,
	<span>Death awaits you all with big, nasty, pointy teeth!</span>,
	<span>What was, shall be. What shall be, was.</span>,
	<span>There's blood on the crown, go and take it.</span>,
	<span>It's dangerous to go alone!</span>,
	<span>↑ ↑ ↓ ↓ ← → ← → B A</span>,
	<span>You are in a twisty maze of passageways, all alike.</span>,
	<span>Segmentation fault (core dumped)</span>,
	<span>Live long and prosper.</span>,
	<span>Blood for the blood god.</span>,
	<span>Hey, you - you're finally awake.</span>,
	<span>You must construct additional pylons.</span>,
	<span>LEEEEEROOOOYY JEEENNNNKIIINSS!</span>,
	<span>Cogito ergo sum.</span>,
	<span>I'll take a potato chip... and eat it!</span>,
	<span>Oh? You're approaching me?</span>,
	<span>The cake is a lie.</span>,
	<span>Are you not entertained?</span>,
	<span>Snakes. Why did it have to be snakes?</span>,
	<span>I solemnly swear that I am up to no good.</span>,
	<span>There is no spoon.</span>,
	<span>Shaken, not stirred.</span>,
	<span>Come with me if you want to live.</span>,
	<span>Maybe it's a dream, maybe nothing else is real.</span>,
	<span>Elementary, my dear Watson.</span>,
	<span>Have fun storming the castle!</span>,
	<span>Houston, we have a problem.</span>,
	<span>I am Groot.</span>,
	<span>I've got a bad feeling about this...</span>,
	<span>May the Force be with you.</span>,
	<span>May the Shwartz be with you.</span>,
	<span>If you can dodge a wrench, you can dodge a ball.</span>,
	<span>Open the pod bay doors, HAL.</span>,
	<span>A little bit of everything, all of the time.</span>,
	<span><a href="https://discord.gg/sdcleague">SDC</a> champion.</span>,
	<span>Time favors the Thallids.</span>
];

export default function OneLiner() {
	// Ensure that the randomized index is the same on the server and the client.
	const [i, setI] = useState(0);
	useEffect(() => setI(Math.floor(Math.random() * oneliners.length)));

	return oneliners[i];
}
