import { useState, useEffect } from "react";
import Link from "next/link";

const oneliners = [
	<span key={1}>Also check out <Link href="https://griff.pw/"><a>griff.pw</a></Link>!</span>,
	<span key={2}>Also check out <Link href="https://ty.business/"><a>ty.business</a></Link>!</span>,
	<span key={3}>Also check out <Link href="https://www.xanycki.art/"><a>xanycki.art</a></Link>!</span>,
	<span key={4}>All your base are belong to us.</span>,
	<code key={5}>{"//"} evil floating point bit level hacking</code>,
	<span key={6}>There{"'"}s a frood who really knows where his towel is.</span>,
	<span key={7}>So Long, and Thanks for All the Fish.</span>,
	<span key={8}>Roads? Where we{"'"}re going, we don{"'"}t need roads!</span>,
	<span key={9}>Trigger, killer, eye of the storm.</span>,
	<span key={10}>Rich Purnell is a steely-eyed missile man!</span>,
	<span key={11}>Death awaits you all with big, nasty, pointy teeth!</span>,
	<span key={12}>What was, shall be. What shall be, was.</span>,
	<span key={13}>There{"'"}s blood on the crown, go and take it.</span>,
	<span key={14}>It{"'"}s dangerous to go alone!</span>,
	<span key={15}>↑ ↑ ↓ ↓ ← → ← → B A</span>,
	<span key={16}>You are in a twisty maze of passageways, all alike.</span>,
	<span key={17}>Segmentation fault (core dumped)</span>,
	<span key={18}>Live long and prosper.</span>,
	<span key={19}>Blood for the blood god.</span>,
	<span key={20}>Hey, you - you{"'"}re finally awake.</span>,
	<span key={21}>You must construct additional pylons.</span>,
	<span key={22}>LEEEEEROOOOYY JEEENNNNKIIINSS!</span>,
	<span key={23}>Cogito ergo sum.</span>,
	<span key={24}>I{"'"}ll take a potato chip... and eat it!</span>,
	<span key={25}>Oh? You{"'"}re approaching me?</span>,
	<span key={26}>The cake is a lie.</span>,
	<span key={27}>Are you not entertained?</span>,
	<span key={28}>Snakes. Why did it have to be snakes?</span>,
	<span key={29}>I solemnly swear that I am up to no good.</span>,
	<span key={30}>There is no spoon.</span>,
	<span key={31}>Shaken, not stirred.</span>,
	<span key={32}>Come with me if you want to live.</span>,
	<span key={33}>Maybe it{"'"}s a dream, maybe nothing else is real.</span>,
	<span key={34}>Elementary, my dear Watson.</span>,
	<span key={35}>Have fun storming the castle!</span>,
	<span key={36}>Houston, we have a problem.</span>,
	<span key={37}>I am Groot.</span>,
	<span key={38}>I{"'"}ve got a bad feeling about this...</span>,
	<span key={39}>May the Force be with you.</span>,
	<span key={40}>May the Shwartz be with you.</span>,
	<span key={41}>If you can dodge a wrench, you can dodge a ball.</span>,
	<span key={42}>Open the pod bay doors, HAL.</span>,
	<span key={43}>A little bit of everything, all of the time.</span>,
	<span key={44}><a href="https://discord.gg/sdcleague">SDC</a> champion.</span>,
	<span key={45}>Time favors the Thallids.</span>
];

export default function OneLiner() {
	// Ensure that the randomized index is the same on the server and the client.
	const [i, setI] = useState(0);
	useEffect(() => setI(Math.floor(Math.random() * oneliners.length)), []);

	return oneliners[i];
}
