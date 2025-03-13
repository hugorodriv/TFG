<script>
    import { signOut } from "@auth/sveltekit/client";
    import { enhance } from "$app/forms";

    export let data;
    const session = data.session;

    export let form;
</script>

<p class="mt-10 text-center text-4xl">Signup</p>
<p class="mt-10 text-center text-1xl">
    About to create an account linked with Google account
    <strong>{session?.user?.email}</strong>
</p>

<p class="text-center text-1xl">Do you want to continue?</p>
<div class="mt-5 text-center border w-20 flex m-auto">
    <button class="rounded p-2 m-auto" on:click={() => signOut()}
        >Log out</button
    >
</div>

<form method="POST" use:enhance class="space-y-4 p-4 max-w-md mx-auto">
    <div>
        <div class="mb-1 font-semibold flex flex-row">
            <label for="username" class="block mb-1 font-semibold">
                Username
            </label>
            <p
                id="usernameAccpeted"
                class="ml-3 text-green-800 font-extralight"
            >
                Available
            </p>
        </div>
        <div class="relative">
            <input
                maxlength="20"
                name="username"
                value={form?.username}
                type="text"
                class="w-full border p-2 rounded pl-7"
                placeholder="username"
                required
            />
            <p
                class="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            >
                @
            </p>
        </div>
    </div>

    <div>
        <label for="bio" class="block mb-1 font-semibold">Bio</label>
        <textarea
            name="bio"
            value={form?.bio}
            placeholder="500 chars max"
            class="w-full border p-2 rounded"
            rows="4"
            maxlength="500"
        ></textarea>
    </div>

    <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
        Create Account
    </button>
    {#if form?.error}
        <h1>{form.error}</h1>
    {/if}
</form>
