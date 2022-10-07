<script lang="ts">
	// @ts-nocheck
	import { fly } from "svelte/transition";
	import { confettiOne, confettiTwo, confettiThree } from "./Confetti.svelte";
	import Settings from "./Settings.svelte";
	import Notifications from "svelte-notifications";
	import { getNotificationsContext } from "svelte-notifications";
	const { addNotification } = getNotificationsContext();

	let subredditData = {
		subreddit: "memes",
		subredditInvalidMessage: null,
		status: 1,
	};
	let data = JSON.parse(localStorage.getItem("subredditData"));
	if (data !== null) {
		subredditData = data;
	}

	let groups: groupDataType[] = [];
	data = JSON.parse(localStorage.getItem("groups"));
	if (data !== null) {
		groups = data;
	} else {
		groups = [
			{
				title: null,
				tasks: [{ text: "", completed: false, id: Date.now() }],
			},
		];
	}
	let currentGroupIndex: number = 0;
	let groupAnim: boolean = false;
	type groupDataType = {
		title: string;
		tasks: taskDataType[];
	};
	type taskDataType = {
		text: string;
		completed: boolean;
		id: number;
	};
	async function addGroup() {
		groups = [
			...groups,
			{
				title: null,
				tasks: [{ text: "", completed: false, id: Date.now() }],
			},
		];
		localStorage.setItem("groups", JSON.stringify(groups));
		currentGroupIndex = groups.length - 1;
		groupAnim = true;
		setTimeout(() => {
			groupAnim = false;
		}, 200);
	}
	function changeGroupName(e) {
		groups[currentGroupIndex].title = e.target.value;
		localStorage.setItem("groups", JSON.stringify(groups));
	}

	type memeDataType = {
		url: string;
		title: string;
		postLink: string;
	};
	let memeData: memeDataType;
	async function fetchMemeData() {
		const resp = await fetch(
			`https://meme-api.herokuapp.com/gimme/${subredditData.subreddit}`
		);
		if (resp.status === 200) {
			const json = await resp.json();
			memeData = json;
		}
		function getRandomInt(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		}
		switch (getRandomInt(1, 3)) {
			case 1:
				confettiOne();
				break;
			case 2:
				confettiTwo();
				break;
			case 3:
				confettiThree();
				break;
		}
	}

	function resetMemeData() {
		memeData = null;
	}
	document.addEventListener("keypress", resetMemeData);
	document.addEventListener("click", resetMemeData);

	function completeTask(e) {
		const index: number = Number(
			e.target.parentElement.getAttribute("data-index")
		);
		groups[currentGroupIndex].tasks[index].completed = true;
		localStorage.setItem("groups", JSON.stringify(groups));

		if (subredditData.status !== 1) {
			addNotification({
				text: "Meme cannot be rewarded because the subreddit chosen in settings is not valid",
				position: "bottom-center",
				type: "error",
			});
			return;
		}
		fetchMemeData();
	}
	function deleteTask(e) {
		const index: number = Number(
			e.target.parentElement.getAttribute("data-index")
		);
		const targetNode = e.target.parentElement;
		let centerX = targetNode.offsetLeft + targetNode.offsetWidth / 2;
		let centerY = targetNode.offsetTop + targetNode.offsetHeight / 2;

		/* var video = document.createElement("video");
		video.style.position = "absolute";
		video.style.left = centerX - 50 + "px";
		video.style.top = centerY - 30 + "px";
		video.style.width = "100px";
		video.src = "explosion.mp4";
		video.autoplay = true;
		video.volume = 0;
		document.body.appendChild(video);
		function fade(element) {
			var op = 1; // initial opacity
			var timer = setInterval(function () {
				if (op <= 0.1) {
					clearInterval(timer);
					element.style.display = "none";
				}
				element.style.opacity = op;
				element.style.filter = "alpha(opacity=" + op * 100 + ")";
				element.style.transform = `scale(${1 + 0.2 / op})`;
				targetNode.style.transform = `scale(${op / 10})`;
				op -= op * 0.15;
			}, 50);
		}
		fade(video);

		setTimeout(() => {
			targetNode.style.transform = `scale(1)`;
			groups[currentGroupIndex].tasks = groups[
				currentGroupIndex
			].tasks.filter((_, i) => index !== i);
			localStorage.setItem("groups", JSON.stringify(groups));
		}, 1000); */
		groups[currentGroupIndex].tasks = groups[
			currentGroupIndex
		].tasks.filter((_, i) => index !== i);
		localStorage.setItem("groups", JSON.stringify(groups));
	}
	function addTask() {
		groups[currentGroupIndex].tasks = [
			...groups[currentGroupIndex].tasks,
			{ text: "", completed: false, id: Date.now() },
		];
		localStorage.setItem("groups", JSON.stringify(groups));
	}
	function editTask(e) {
		localStorage.setItem("groups", JSON.stringify(groups));
	}
	function removeGroup() {
		const length = groups.length;
		groups = groups.filter((_, i) => currentGroupIndex !== i);
		localStorage.setItem("groups", JSON.stringify(groups));
		if (currentGroupIndex === length - 1) {
			//if we are the last group then we must shift the index back one
			currentGroupIndex--;
		}
	}

	let mouseYCoordinate = null; // pointer y coordinate within client
	let distanceTopGrabbedVsPointer = null;

	let draggingItem = null;
	let draggingItemId = null;
	let draggingItemIndex = null;

	let hoveredItemIndex = null;

	$: {
		if (
			draggingItemIndex != null &&
			hoveredItemIndex != null &&
			draggingItemIndex != hoveredItemIndex
		) {
			// swap items
			[
				groups[currentGroupIndex].tasks[draggingItemIndex],
				groups[currentGroupIndex].tasks[hoveredItemIndex],
			] = [
				groups[currentGroupIndex].tasks[hoveredItemIndex],
				groups[currentGroupIndex].tasks[draggingItemIndex],
			];

			// balance
			draggingItemIndex = hoveredItemIndex;
			//save
			localStorage.setItem("groups", JSON.stringify(groups));
		}
	}

	let settingsOpen = false;
</script>

<main>
	<Notifications>
		{#if settingsOpen}
			<Settings bind:settingsOpen bind:subredditData />
		{:else}
			{#if !memeData}
				<div
					transition:fly={{ x: -200, duration: 200 }}
					class="groupbar"
				>
					{#each groups as group, i}
						{#if i === currentGroupIndex}
							{#if groupAnim}
								<span
									class="selected tab"
									in:fly={{ x: -200, duration: 200 }}
									>{group.title || "Untitled Job"}</span
								>
							{:else}
								<span class="selected tab"
									>{group.title || "Untitled Job"}</span
								>
							{/if}
						{:else}
							<span
								class="tab"
								on:click={() => (currentGroupIndex = i)}
								>{group.title || "Untitled Job"}</span
							>
						{/if}
					{/each}
					<span on:click={addGroup}
						><svg
							class="plus"
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							preserveAspectRatio="xMidYMid meet"
							viewBox="0 0 24 24"
							><path
								fill="none"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-width="2"
								d="M12 20v-8m0 0V4m0 8h8m-8 0H4"
							/></svg
						></span
					>
				</div>

				{#if groups[0] !== undefined}
					<span
						on:click={() => (settingsOpen = true)}
						id="settingsButton"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							width="1.5em"
							height="1.5em"
							preserveAspectRatio="xMidYMid meet"
							viewBox="0 0 24 24"
							><path
								fill="#3b3b3b"
								d="M13.82 22h-3.64a1 1 0 0 1-.977-.786l-.407-1.884a8.002 8.002 0 0 1-1.535-.887l-1.837.585a1 1 0 0 1-1.17-.453L2.43 15.424a1.006 1.006 0 0 1 .193-1.239l1.425-1.3a8.1 8.1 0 0 1 0-1.772L2.623 9.816a1.006 1.006 0 0 1-.193-1.24l1.82-3.153a1 1 0 0 1 1.17-.453l1.837.585c.244-.18.498-.348.76-.5c.253-.142.513-.271.779-.386l.408-1.882A1 1 0 0 1 10.18 2h3.64a1 1 0 0 1 .976.787l.412 1.883a8.192 8.192 0 0 1 1.535.887l1.838-.585a1 1 0 0 1 1.169.453l1.82 3.153c.232.407.152.922-.193 1.239l-1.425 1.3a8.1 8.1 0 0 1 0 1.772l1.425 1.3c.345.318.425.832.193 1.239l-1.82 3.153a1 1 0 0 1-1.17.453l-1.837-.585a7.98 7.98 0 0 1-1.534.886l-.413 1.879a1 1 0 0 1-.976.786ZM11.996 8a4 4 0 1 0 0 8a4 4 0 0 0 0-8Z"
							/></svg
						></span
					>
					<h1 transition:fly={{ x: -200, duration: 200 }}>
						<input
							placeholder="Untitled Job"
							id="groupName"
							value={groups[currentGroupIndex].title}
							on:input={changeGroupName}
						/>
					</h1>
					<button
						id="removeGroup"
						on:click={removeGroup}
						transition:fly={{ x: -200, duration: 200 }}
						>Remove job</button
					>
					<div
						class="todoList"
						transition:fly={{ x: -200, duration: 200 }}
					>
						{#each groups[currentGroupIndex].tasks as task, i (task.id)}
							<div
								in:fly|local={{
									x: -200,
									duration: 200,
								}}
								out:fly|local={{
									x: -200,
									duration: 100,
								}}
								data-index={i}
								class="todoItem {draggingItemId === task.id
									? 'invisible'
									: ''}"
							>
								<span
									class="dragger"
									draggable="true"
									on:dragstart={(e) => {
										mouseYCoordinate = e.clientY;
										//console.log('dragstart', mouseYCoordinate);

										draggingItem = task;
										draggingItemIndex = i;
										draggingItemId = task.id;

										distanceTopGrabbedVsPointer =
											e.target.getBoundingClientRect().y -
											e.clientY;
									}}
									on:drag={(e) => {
										mouseYCoordinate = e.clientY;
										//console.log('drag', mouseYCoordinate);
									}}
									on:dragover={(e) => {
										hoveredItemIndex = i;
									}}
									on:dragend={(e) => {
										//console.log('dragend', mouseYCoordinate);
										//console.log('\n');

										// mouseYCoordinate = e.clientY;

										draggingItemId = null; // makes item visible
										hoveredItemIndex = null; // prevents instant swap
									}}
									><svg
										xmlns="http://www.w3.org/2000/svg"
										width="1em"
										height="1em"
										preserveAspectRatio="xMidYMid meet"
										viewBox="0 0 24 24"
										><path
											fill="currentColor"
											fill-rule="evenodd"
											d="M22 8a2 2 0 1 1-4 0a2 2 0 0 1 4 0Zm0 8a2 2 0 1 1-4 0a2 2 0 0 1 4 0Zm-8 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0ZM6 8a2 2 0 1 1-4 0a2 2 0 0 1 4 0Zm0 8a2 2 0 1 1-4 0a2 2 0 0 1 4 0Zm8-8a2 2 0 1 1-4 0a2 2 0 0 1 4 0Z"
											clip-rule="evenodd"
										/></svg
									></span
								>
								{#if !task.completed}
									<div
										on:input={editTask}
										bind:innerHTML={task.text}
										contenteditable="true"
										class={task.completed
											? "todoText completedTodoText"
											: "todoText"}
									>
										{task.text}
									</div>
								{:else}
									<div
										on:input={editTask}
										bind:innerHTML={task.text}
										contenteditable="false"
										class={task.completed
											? "todoText completedTodoText"
											: "todoText"}
									>
										{task.text}
									</div>
								{/if}
								{#if !task.completed}
									<button
										class="check"
										on:click={completeTask}
										><svg
											xmlns="http://www.w3.org/2000/svg"
											width="1em"
											height="1em"
											preserveAspectRatio="xMidYMid meet"
											viewBox="0 0 24 24"
											><path
												fill="#0f9d58"
												fill-rule="evenodd"
												d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1Zm4.768 9.14a1 1 0 1 0-1.536-1.28l-4.3 5.159l-2.225-2.226a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.475-.067l5-6Z"
												clip-rule="evenodd"
											/></svg
										></button
									>
								{/if}
								<button class="trash" on:click={deleteTask}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="0.88em"
										height="1em"
										preserveAspectRatio="xMidYMid meet"
										viewBox="0 0 448 512"
										><path
											fill="#3b3b3b"
											d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0h120.4c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64s14.3-32 32-32h96l7.2-14.3zM32 128h384v320c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"
										/></svg
									>
								</button>
							</div>
							{#if i !== groups[currentGroupIndex].tasks.length - 1}
								<hr />
							{/if}
						{/each}
						<button
							id="addNewTask"
							on:click={addTask}
							transition:fly={{ x: -200, duration: 200 }}
							>Add new task</button
						>
					</div>
				{/if}
			{/if}
			{#if memeData}
				<div
					class="memeContainer"
					on:click={(e) => e.stopPropagation()}
				>
					<h2 transition:fly={{ y: 100, duration: 300 }}>
						{memeData.title}
					</h2>
					<a target="_blank" href={memeData.postLink}>
						<img
							class="memeImage"
							alt="meme"
							src={memeData.url}
							transition:fly={{ y: 100, duration: 300 }}
						/>
					</a>
					<h3 transition:fly={{ y: 100, duration: 300 }}>
						Press any key to continue
					</h3>
				</div>
			{/if}

			{#if mouseYCoordinate}
				<div
					class="todoItem item ghost"
					style="top: {mouseYCoordinate +
						distanceTopGrabbedVsPointer}px;left:{document.querySelector(
						'.todoItem'
					).offsetLeft -
						50 +
						'px'}"
				>
					<span class="dragger"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							width="1em"
							height="1em"
							preserveAspectRatio="xMidYMid meet"
							viewBox="0 0 24 24"
							><path
								fill="currentColor"
								fill-rule="evenodd"
								d="M22 8a2 2 0 1 1-4 0a2 2 0 0 1 4 0Zm0 8a2 2 0 1 1-4 0a2 2 0 0 1 4 0Zm-8 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0ZM6 8a2 2 0 1 1-4 0a2 2 0 0 1 4 0Zm0 8a2 2 0 1 1-4 0a2 2 0 0 1 4 0Zm8-8a2 2 0 1 1-4 0a2 2 0 0 1 4 0Z"
								clip-rule="evenodd"
							/></svg
						></span
					>
					<div
						on:input={editTask}
						bind:innerHTML={draggingItem.text}
						contenteditable="false"
						class={draggingItem.completed
							? "todoText completedTodoText"
							: "todoText"}
					/>
					{#if !draggingItem.completed}
						<button class="check"
							><svg
								xmlns="http://www.w3.org/2000/svg"
								width="1em"
								height="1em"
								preserveAspectRatio="xMidYMid meet"
								viewBox="0 0 24 24"
								><path
									fill="#0f9d58"
									fill-rule="evenodd"
									d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1Zm4.768 9.14a1 1 0 1 0-1.536-1.28l-4.3 5.159l-2.225-2.226a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.475-.067l5-6Z"
									clip-rule="evenodd"
								/></svg
							></button
						>
					{/if}
					<button class="trash">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="0.88em"
							height="1em"
							preserveAspectRatio="xMidYMid meet"
							viewBox="0 0 448 512"
							><path
								fill="#3b3b3b"
								d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0h120.4c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64s14.3-32 32-32h96l7.2-14.3zM32 128h384v320c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z"
							/></svg
						>
					</button>
				</div>
			{/if}
		{/if}
	</Notifications>
</main>

<style>
	span:not(.strikeSpan):not(#settingsButton) {
		padding-left: 5px;
		padding-right: 5px;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		user-select: none;
		cursor: pointer;
		box-shadow: rgba(0, 0, 0, 0.06) 0px 2px 4px 0px inset;
	}
	.tab {
		white-space: nowrap;
	}
	#groupName {
		text-align: center;
		background-color: #f4f4f4;
		border-radius: 2px;
		color: #000;
		font-size: xx-large;
		display: block;
		margin: auto;
		border-radius: 5px;
	}
	h1 {
		margin-top: 10px;
		margin-bottom: 10px;
	}
	h2 {
		text-align: center;
	}
	h3 {
		text-align: center;
	}
	hr {
		border: 0;
		height: 0;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid rgba(255, 255, 255, 0.3);
	}
	span:not(.strikeSpan):not(#settingsButton):hover {
		box-shadow: rgba(17, 17, 26, 0.05) 0px 1px 0px,
			rgba(17, 17, 26, 0.1) 0px 0px 8px;
	}
	.plus {
		width: 20px;
		height: 20px;
		position: relative;
		top: 50%;
		transform: translateY(-50%);
	}
	.selected {
		color: #fff;
		background-color: #3b3b3b !important;
	}
	img {
		position: absolute;
	}
	.memeImage {
		position: relative;
		width: 100%;
	}
	.memeContainer {
		display: block;
		max-width: 60%;
		position: absolute;
		top: 30px;
		left: 0;
		right: 0;
		margin-left: auto;
		margin-right: auto;
		transform: scale(1);
		transition: all 0.2s ease-in-out;
	}
	.memeContainer:hover {
		transform: scale(1.05);
	}
	main {
		overflow-x: hidden;
	}
	.groupbar {
		display: inline-flex;
		gap: 1px;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}
	.todoList {
		margin: auto;
		width: fit-content;
	}
	.todoText {
		width: 300px;
		background-color: #f4f4f4;
		border-radius: 2px;
		color: #000;
		padding: 4px;
		border-color: #cccccc;
		border-width: 1px;
		word-wrap: break-word;
		border-style: solid;
	}
	#settingsButton {
		position: absolute;
		right: 5px;
		top: 40px;
		transition: transform 0.5s ease-in-out;
		width: 1.5em;
		height: 1.5em;
		cursor: pointer;
	}
	#settingsButton:hover {
		transform: rotate(360deg);
	}
	@keyframes strike {
		from {
			text-decoration-color: transparent;
		}
		to {
			text-decoration-color: auto;
		}
	}
	.completedTodoText {
		color: #0f9d58;
		text-decoration: line-through;
		animation: strike 0.3s linear;
	}
	.todoItem {
		margin: 10px;
		margin-bottom: 2px;
		margin-top: 2px;
		margin-bottom: 7px;
		margin-left: 50px;
		display: flex;
		gap: 8px;
		box-shadow: rgba(99, 99, 99, 0.15) 0px 2px 8px 0px;
	}
	.check {
		margin: 0;
		height: 50px;
		width: 50px;
		cursor: pointer;
	}
	.trash {
		margin: 0;
		height: 50px;
		width: 50px;
		cursor: pointer;
	}
	#addNewTask,
	#removeGroup {
		margin: auto;
		display: block;
		cursor: pointer;
	}
	#addNewTask {
		margin-top: 10px;
	}
	#removeGroup {
		margin-bottom: 30px;
	}
	svg {
		pointer-events: none;
	}
	.dragger {
		margin-left: -50px;
		padding-top: 12px;
		cursor: move !important;
		cursor: grab !important;
	}
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	.ghost {
		margin-bottom: 10px;
		pointer-events: none;
		z-index: 99;
		position: absolute;
		top: 0;
	}

	.invisible {
		opacity: 0;
	}
</style>
