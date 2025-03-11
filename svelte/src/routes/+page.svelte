<script>
    import Auth from "./auth.svelte";

    import { signOut } from "@auth/sveltekit/client";
    import { page } from "$app/stores";
</script>

<div class="p-20">
    <!-- <Auth /> -->

    {#if !$page.data.session}
        <h1>Not logged in</h1>
        <Auth />
    {:else}
        <h1>Logged in</h1>
        {#if $page.data.session.user}
            <p>Signed in as {$page.data.session.user?.name}</p>
        {/if}

        <button on:click={() => signOut()}>Log out</button>
    {/if}
</div>
