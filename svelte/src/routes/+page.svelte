<script>
    import Auth from "./auth.svelte";
    import Navbar from "./Navbar.svelte";

    import { signOut } from "@auth/sveltekit/client";
    import { page } from "$app/stores";
</script>

<div>
    <!-- <Auth /> -->

    {#if !$page.data.session}
        <Auth />
    {:else}
        <Navbar />
    {/if}
</div>
