<script>
    import { fly } from "svelte/transition";
    export let settingsOpen;
    export let subredditData;
    async function validateSubreddit(e) {
        let inputSubreddit = e.target.value;
        subredditData.subreddit = inputSubreddit;

        if (inputSubreddit === "") {
            subredditData.subredditInvalidMessage = "Please input a subreddit";
            subredditData.status = 0;
            localStorage.setItem("subredditData", JSON.stringify(subredditData));
            return;
        }
        const resp = await fetch(
            `https://meme-api.herokuapp.com/gimme/${inputSubreddit}`
        );
        if (inputSubreddit === subredditData.subreddit) { //make sure that it hasn't changed since the last request we made
            if (resp.status !== 200) {
                subredditData.subredditInvalidMessage = "Subreddit is not valid or has no posts";
                subredditData.status = 0;
            } else {
                subredditData.subredditInvalidMessage = null;
                subredditData.status = 1;
            }
        }
        localStorage.setItem("subredditData", JSON.stringify(subredditData));
    }
</script>

<main transition:fly={{ x: 200, duration: 200 }}>
    <span on:click={() => (settingsOpen = false)} id="backButton"
        ><svg
            class="backIcon"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 24 24"
            ><g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                ><path d="m8 5l-5 5l5 5" /><path
                    d="M3 10h8c5.523 0 10 4.477 10 10v1"
                /></g
            ></svg
        >Back</span
    >
    <h2>Settings</h2>
    <form>
        <label for="subredditInput">Subreddit</label>
        <span class="light">https://www.reddit.com/r/</span><input
            on:input={validateSubreddit}
            id="subredditInput"
            type="text"
            bind:value={subredditData.subreddit}
        />
        {#if subredditData.subredditInvalidMessage}
            <div class="notValid">{subredditData.subredditInvalidMessage}</div>
        {/if}
    </form>
</main>

<style>
    main{
        position: absolute;
        top:0;
        padding: 3px;
    }
    h2 {
        text-align: center;
    }
    label {
        padding-bottom: 5px;
    }
    #backButton {
        cursor: pointer;
    }
    #backButton:hover {
        text-decoration: underline;
    }
    .backIcon {
        margin-right: 3px;
    }
    .light {
        color: #757575;
    }
    .notValid {
        color: red;
    }
</style>
