<script>
    import { accountStore } from "$lib/stores/accStore.js";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    import Auth from "./auth.svelte";
    import Navbar from "./Navbar.svelte";

    export let data;
    const session = data.session;

    onMount(() => {
        const accountData = $accountStore;
        if (!accountData) {
            goto("/successfulLogin");
        }
    });
</script>

<div>
    {#if !session}
        <Auth />
    {:else}
        <Navbar />
    {/if}
</div>
