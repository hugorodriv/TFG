<script>
    import { signIn, signOut } from "@auth/sveltekit/client";
    import { page } from "$app/stores";
    console.log($page.data?.session?.user?.image);
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
        <button
            class="m-auto flex text-center bg-gray-700 py-1 px-2 rounded text-white font-bold mt-10"
            on:click={() => signOut()}
        >
            Sign out</button
        >
    {:else}
        <h1>Not logged in</h1>
        <button
            class="m-auto flex text-center bg-blue-500 py-1 px-2 rounded text-white font-bold mt-10"
            on:click={() => signIn("google")}
        >
            Sign in with Google</button
        >
    {/if}
</div>
