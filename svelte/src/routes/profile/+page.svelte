<script>
    import { signOut } from "@auth/sveltekit/client";
    import { enhance } from "$app/forms";

    import { onMount } from "svelte";
    import { accountStore } from "$lib/stores/accStore.js";
    import { goto } from "$app/navigation";

    import PictureCrop from "./pictureCrop.svelte";
    import Navbar from "../Navbar.svelte";

    const accountData = $accountStore;
    onMount(() => {
        const accountData = $accountStore;
        if (!accountData) {
            goto("/successfulLogin");
        }
    });

    const currentProfilePicture = accountData?.img || "";

    export let data;
    const accData = data.accData;
    const email = data.email;

    export let form;

    let changingPfp = false;
    /**
     * @type {null}
     */
    let finalProfilePicture = null;
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

    <label for="pfp" class="block mb-1 font-semibold"> Profile Picture </label>

    <!-- Change profile picture -->
    {#if changingPfp && !form?.success && !form?.error}
        <div>
            {#if finalProfilePicture}
                <img
                    alt="new profile"
                    class="my-2 border-2"
                    src={finalProfilePicture}
                />

                <button class="bg-green-700 text-white px-4 py-2 rounded">
                    Upload new profile picture
                </button>
            {:else}
                <PictureCrop bind:finalProfilePicture />
            {/if}
        </div>
    {:else}
        <!-- TODO:  Display profile picture of user if they already have one-->
        <img alt="current profile" src={currentProfilePicture} />
        <button
            class="bg-blue-600 text-white px-4 py-2 rounded"
            on:click={() => (changingPfp = true)}
        >
            Change
        </button>
    {/if}

    <!-- Change user details  -->
    {#if !form?.success && !form?.error && !changingPfp}
        <form class="" method="POST" use:enhance>
            <div>
                <label for="name" class="block mb-1 font-semibold">Name</label>
                <input
                    value={accData.name}
                    name="name"
                    class="w-full border p-2 rounded"
                    maxlength="20"
                />
            </div>

            <div>
                <label for="bio" class="block mb-1 font-semibold">Bio</label>
                <textarea
                    name="bio"
                    class="w-full border p-2 rounded"
                    maxlength="500">{accData.bio}</textarea
                >
            </div>

            <button
                type="submit"
                class="bg-blue-600 text-white px-4 py-2 rounded"
            >
                Update
            </button>
        </form>
    {/if}
    {#if form?.success}
        <h1>Successfully updated</h1>
        <h2>Redirecting . . .</h2>

        <script>
            setTimeout(() => {
                // "hard" redirect to make sure accData gets re-populated
                window.location.href = "/";
            }, 1000);
        </script>
    {/if}
    {#if form?.error}
        <h1>Error updating details. Try again</h1>
        <h2>Redirecting . . .</h2>

        <script>
            setTimeout(() => {
                // "hard" redirect to make sure accData gets re-populated
                window.location.href = "/profile";
            }, 1000);
        </script>
    {/if}
</div>
