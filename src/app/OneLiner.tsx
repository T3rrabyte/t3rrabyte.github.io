"use client";

import DynamicLink from "#DynamicLink";
import {
	useState,
	useEffect,
	type JSX,
	type DetailedHTMLProps,
	type HTMLAttributes,
	type Dispatch,
	type SetStateAction,
	type EffectCallback
} from "react";

const oneLiners: Array<JSX.Element> = [
	<span key={-1}>{"Loading..."}</span>, // Pre-render value.
	<span key={0}>
		{"Also check out "}
		<DynamicLink href="https://griff.pw/">{"griff.pw"}</DynamicLink>
		{"!"}
	</span>, // Griffon Hanson
	<span key={1}>
		{"Also check out "}
		<DynamicLink href="https://ty.business/">{"ty.business"}</DynamicLink>
		{"!"}
	</span>, // Ty Morrow
	<span key={2}>
		{"Also check out "}
		<DynamicLink href="https://www.xanycki.art/">{"xanycki.art"}</DynamicLink>
		{"!"}
	</span>, // Anonymous friend
	<span key={3}>{"All your base are belong to us."}</span>, // Zero Wing
	<code key={4}>{"// evil floating point bit level hacking"}</code>, // Fast inverse square root; Quake III Arena
	<span key={5}>{"There's a frood who really knows where his towel is."}</span>, // The Hitchhiker's Guide to the Galaxy
	<span key={6}>{"So Long, and Thanks for All the Fish."}</span>, // The Hitchhiker's Guide to the Galaxy
	<span key={7}>{"Roads? Where we're going, we don't need roads!"}</span>, // Back to the Future
	<span key={8}>{"Trigger, killer, eye of the storm."}</span>, // Zero Eclipse; Attack on Titan
	<span key={9}>{"Rich Purnell is a steely-eyed missile man!"}</span>, // The Martian
	<span key={10}>{"Death awaits you all with big, nasty, pointy teeth!"}</span>, // The Killer Rabbit of Caerbannog; Monty Python and the Holy Grail
	<span key={11}>{"What was, shall be. What shall be, was."}</span>, // The Worm-in-Waiting; Horizon Signal; Stellaris
	<span key={12}>{"There's blood on the crown, go and take it."}</span>, // Rise; League of Legends
	<span key={13}>{"It's dangerous to go alone!"}</span>, // The Legend of Zelda
	<span key={14}>{"^ ^ v v < > < > B A S"}</span>, // The Konami Code
	<span key={15}>
		{"You are in a maze of twisty little passages, all alike."}
	</span>, // Colossal Cave Adventure
	<span key={16}>{"Xyzzy"}</span>, // Colossal Cave Adventure
	<span key={17}>{"Segmentation fault (core dumped)"}</span>, // Memory access error in C
	<span key={18}>{"Live long and prosper."}</span>, // The Vulcan salute; Star Trek
	<span key={19}>{"Blood for the blood god."}</span>, // The Chaos God Khorne; Warhammer 40,000
	<span key={20}>{"Hey, you - you're finally awake."}</span>, // The Elder Scrolls V: Skyrim
	<span key={21}>{"You must construct additional pylons."}</span>, // Protoss; Starcraft
	<span key={22}>{"LEEEEEROOOOYY JEEENNNNKIIINSS!"}</span>, // World of Warcraft
	<span key={23}>{"Cogito, ergo sum."}</span>, // "I think, therefore I am."; René Descartes
	<span key={24}>{"I'll take a potato chip... and eat it!"}</span>, // Light "Kira" Yagami; Death Note
	<span key={25}>{"Oh? You're approaching me?"}</span>, // Dio Brando; JoJo's Bizarre Adventure
	<span key={26}>{"The cake is a lie."}</span>, // Portal
	<span key={27}>{"Are you not entertained?"}</span>, // Maximus; Gladiator
	<span key={28}>{"Snakes. Why did it have to be snakes?"}</span>, // Indiana Jones
	<span key={29}>{"I solemnly swear that I am up to no good."}</span>, // Harry Potter and the Prizoner of Azkaban
	<span key={30}>{"There is no spoon."}</span>, // The Matrix
	<span key={31}>{"Shaken, not stirred."}</span>, // James Bond
	<span key={32}>{"Come with me if you want to live."}</span>, // Terminator
	<span key={33}>{"Maybe it's a dream, maybe nothing else is real."}</span>, // Bad Apple!!; Touhou Project
	<span key={34}>{"Elementary, my dear Watson."}</span>, // Sherlock Holmes
	<span key={35}>{"Have fun storming the castle!"}</span>, // The Princess Bride
	<span key={36}>{"Houston, we have a problem."}</span>, // Apollo 13; NASA
	<span key={37}>{"I am Groot."}</span>, // The Guardians of the Galaxy
	<span key={38}>{"I've got a bad feeling about this..."}</span>, // Star Wars
	<span key={39}>{"May the Force be with you."}</span>, // Star Wars
	<span key={30}>{"May the Shwartz be with you."}</span>, // Spaceballs
	<span key={41}>{"If you can dodge a wrench, you can dodge a ball."}</span>, // Dodgeball: A True Underdog Story
	<span key={42}>{"Open the pod bay doors, HAL."}</span>, // 2001: A Space Odyssey
	<span key={43}>{"A little bit of everything, all of the time."}</span>, // Welcome to the Internet; Bo Burnham; Inside
	<span key={44}>
		<DynamicLink href="https://discord.gg/sdcleague">{"SDC"}</DynamicLink>
		{" champion."}
	</span>, // The Seasonal Draft Championship; League of Legends
	<span key={45}>{"Time favors the Thallids."}</span>, // Magic: The Gathering
	<span key={46}>{"WD-40 Fan"}</span>, // Inside joke
	<span key={47}>
		{"Another way to feel what you didn't want yourself to know."}
	</span>, // I Really Want to Stay at Your House; Cyberpunk: Edgerunners
	<code key={48}>{":(){ :|:&};:"}</code>, // Shell fork bomb
	<span key={49}>{"Excelsior!"}</span>, // "Ever upward!"; Stan Lee; Marvel
	<span key={50}>
		{
			"Day before yesterday I saw a rabbit, and yesterday a deer, and today, you."
		}
	</span>, // The Dandelion Girl; Clannad
	<span key={51}>{"El Psy Kongroo"}</span>, // Steins;Gate
	<span key={52}>
		{"If everyone is not special, maybe you can be what you want to be."}
	</span>, // 99; MOB CHOIR; Mob Psycho 100
	<span key={53}>{"God drinks Java."}</span>, // world.execute(me);; Mili
	<span key={54}>{"SEE YOU SPACE COWBOY..."}</span>, // Cowboy Bebop
	<span key={55}>{"Dodge, duck, dip, dive, and dodge."}</span>, // Dodgeball: A True Underdog Story
	<span key={56}>{'I\'m always dreaming, believing "ideal" exists.'}</span>, // Thousand Absolutes; DEMONDICE, Omega Strikers
	<span key={57}>{"My naked heart can hear echoes, echoes."}</span>, // Avid; Hiroyuki Sawano; 86 EIGHTY-SIX
	<span key={58}>{"I turn the page to drown you out."}</span> // Voices of the Chord; Hiroyuki Sawano; 86 EIGHTY-SIX
];

export default function OneLiner(
	props: DetailedHTMLProps<
		HTMLAttributes<HTMLParagraphElement>,
		HTMLParagraphElement
	>
): JSX.Element {
	const [i, setI]: [number, Dispatch<SetStateAction<number>>] = useState(0);

	const effectCallback: EffectCallback = (): void =>
		setI(Math.floor(Math.random() * (oneLiners.length - 1) + 1));
	useEffect(effectCallback, []);

	return <p {...props}>{oneLiners[i]}</p>;
}
