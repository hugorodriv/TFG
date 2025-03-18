<script>
    import { signOut } from "@auth/sveltekit/client";
    import { enhance } from "$app/forms";
    import PictureCrop from "./pictureCrop.svelte";
    import Navbar from "../Navbar.svelte";

    export let data;
    const accData = data.accData;
    const email = data.email;

    export let form;
</script>

<Navbar />
<p class="mt-10 text-center text-4xl">Profile settings</p>

<div class="space-y-4 p-4 max-w-md m-auto">
    <div>
        <label for="username" class="block mb-1 font-semibold">Email</label>
        <p class="w-full border p-2 rounded bg-gray-200">
            {email}
        </p>

        <label for="username" class="mt-4 block mb-1 font-semibold"
            >Username</label
        >
        <p class="w-full border p-2 rounded bg-gray-200">
            {accData.username}
        </p>
    </div>
    <div class="my-5 border w-20 flex m-auto">
        <button class="rounded p-2 m-auto" on:click={() => signOut()}
            >Log out</button
        >
    </div>

    <form method="POST" use:enhance>
        <div>
            <label for="pfp" class="block mb-1 font-semibold"
                >Profile Picture</label
            >

            <PictureCrop />
        </div>
        <div>
            <label for="name" class="block mb-1 font-semibold">Name</label>
            <input
                value={form?.data?.name || accData.name}
                name="name"
                class="w-full border p-2 rounded"
                maxlength="20"
            />
        </div>

        <div>
            <label for="bio" class="block mb-1 font-semibold">Bio</label>
            <textarea
                value={form?.data?.bio || accData.bio}
                name="bio"
                class="w-full border p-2 rounded"
                maxlength="500"
            ></textarea>
        </div>

        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
            Update
        </button>
        {#if form?.success}
            <h1>Succesfully updated</h1>
        {/if}
        {#if form?.error}
            <h1>Error updating details. Try again</h1>
        {/if}
    </form>
</div>
