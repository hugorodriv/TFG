<script>
    import { onMount } from "svelte";

    import Auth from "./auth.svelte";
    import Navbar from "./Navbar.svelte";
    import Bottombar from "./Bottombar.svelte";

    export let data;
    const session = data.session;

    let accountData;
    let pfp;
    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData")) || null;
        pfp = localStorage.getItem("pfp");
    });
</script>

<div>
    {#if !session}
        <Auth />
    {:else}
        <Navbar />
        <Bottombar homeActive={true} />
    {/if}
</div>
