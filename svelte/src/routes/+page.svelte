<script>
    import Auth from "./auth.svelte";
    import Navbar from "./Navbar.svelte";

    export let data;
    const session = data.session;
</script>

<div>
    <!-- <Auth /> -->

    {#if !session}
        <Auth />
    {:else}
        <Navbar {session} />
    {/if}
</div>
