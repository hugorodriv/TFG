<script>
    import { SignIn, SignOut } from "@auth/sveltekit/components";
    import { page } from "$app/stores";
    console.log($page.data);
</script>

<p class="mt-10 text-center text-4xl">Auth component</p>
<div class="mt-10 p-10">
    {#if $page.data.session}
        {#if $page.data.session.user?.image}
            <img
                class="w-12 h-12"
                alt="user img"
                src={$page.data.session.user?.image}
            />
        {/if}
        <p>Signed in as {$page.data.session.user?.name}</p>
        <p>Email: {$page.data.session.user?.email}</p>

        <SignOut class="border-1" />
    {:else}
        <h1>Not logged in</h1>

        <SignIn class="border-1" provider="google" />
    {/if}
</div>
