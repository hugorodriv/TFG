<script>
    import { signOut } from "@auth/sveltekit/client";
    import { enhance } from "$app/forms";

    import { onMount } from "svelte";

    import PictureCrop from "./pictureCrop.svelte";
    import Navbar from "../Navbar.svelte";

    let accountData;
    /**
     * @type {string | null}
     */
    let pfp;
    let nameTooShort = false;
    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData")) || null;
        pfp = localStorage.getItem("pfp");
    });

    export let data;
    const accData = data.accData;
    const email = data.email;

    export let form;

    let changingPfp = false;
    let detailsChanged = false;
    /**
     * @type {null}
     */
    let finalProfilePicture = null;

    let confirmAccountDeletionButton = false;
    let confirmRemovePfp = false;

    async function uploadPfp() {
        const response_changePfpUrl = await fetch(`/api/changePfp`);

        const data = await response_changePfpUrl.json();
        // console.log(data);
        if (!data.success) {
            // server side error
        }

        const myHeaders = new Headers({ "Content-Type": "image/*" });
        try {
            const response_put = await fetch(data.url, {
                method: "PUT",
                headers: myHeaders,
                body: finalProfilePicture,
            });

            if (!response_put.ok) {
                alert("Error changing profile picture");
                console.log(response_put);
            }

            // update localStorage for pfp
            // throw redirect(301, "/successfulLogin");

            const reader = new FileReader();
            reader.readAsDataURL(finalProfilePicture);
            reader.onloadend = function () {
                const base64data = reader.result;
                console.log(base64data);

                localStorage.setItem("pfp", base64data);
                pfp = base64data;
            };
        } catch (error) {
            alert("Error changing profile picture");
        }
    }

    async function removePfp() {
        const response_changePfpUrl = await fetch(`/api/removePfp`);

        const data = await response_changePfpUrl.json();
        console.log(data);
        // if (!data.success) {
        //     // server side error
        // }
    }
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
        <button
            class="cursor-pointer rounded p-2 m-auto"
            on:click={() => signOut()}>Log out</button
        >
    </div>

    <!-- Change profile picture -->
    {#if !confirmAccountDeletionButton}
        <label for="pfp" class="block mb-1 font-semibold">
            Profile Picture
        </label>
        {#if changingPfp && !form?.success && !form?.error}
            <div>
                {#if finalProfilePicture}
                    <img
                        alt="new profile"
                        class="my-2"
                        src={URL.createObjectURL(finalProfilePicture)}
                    />

                    <button
                        class="cursor-pointer bg-green-700 text-white px-4 py-2 rounded"
                        on:click={() => uploadPfp()}
                    >
                        Update
                    </button>
                {:else}
                    <PictureCrop bind:finalProfilePicture />
                {/if}
            </div>
        {:else}
            <img alt="current profile" src={pfp} />

            {#if confirmRemovePfp}
                <button
                    class="cursor-pointer bg-red-700 font-bold text-white px-4 py-2 rounded"
                    on:click={removePfp}
                >
                    Confirm removal profile picture
                </button>
            {:else}
                <button
                    class="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded"
                    on:click={() => (changingPfp = true)}
                >
                    Change
                </button>
                <button
                    class="cursor-pointer underline align-bottom font-bold rounded"
                    on:click={() => (confirmRemovePfp = true)}
                >
                    Remove
                </button>
            {/if}
        {/if}
    {/if}

    <!-- Change user details  -->
    {#if !confirmAccountDeletionButton && !form?.success && !form?.error}
        <form
            class=""
            method="POST"
            use:enhance
            action="?/updateDetails"
            on:input={(e) => {
                if (e.target.form.name.value.length < 1) {
                    nameTooShort = true;
                } else {
                    nameTooShort = false;
                }

                if (
                    e.target.form.bio.value != accData.bio ||
                    e.target.form.name.value != accData.name
                ) {
                    detailsChanged = true;
                } else {
                    detailsChanged = false;
                }
            }}
        >
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
                <label for="bio" class="block my-1 font-semibold">Bio</label>
                <textarea
                    name="bio"
                    class="min-h-64 w-full border p-2 rounded"
                    maxlength="500">{accData.bio}</textarea
                >
            </div>

            {#if detailsChanged && !nameTooShort}
                <button
                    type="submit"
                    class="cursor-pointer bg-green-700 text-white px-4 py-2 rounded"
                >
                    Update
                </button>
            {:else}
                <p class="w-fit bg-gray-500 text-white px-4 py-2 rounded">
                    Update
                </p>
            {/if}
        </form>
    {/if}

    {#if form?.success}
        <h1>Successfully updated</h1>
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

    <p class="mt-12 font-bold">Account deletion</p>
    {#if confirmAccountDeletionButton}
        <form method="POST" action="?/deleteAccount">
            <button
                on:click={() => {
                    confirmAccountDeletionButton = true;
                    localStorage.clear();
                }}
                type="submit"
                class="w-full h-12 cursor-pointer bg-red-800 font-bold text-white px-4 py-2 rounded"
            >
                Confirm delete account
            </button>
        </form>
    {:else}
        <button
            on:click={() => {
                confirmAccountDeletionButton = true;
            }}
            class="cursor-pointer bg-red-700 font-bold text-white px-4 py-2 rounded"
        >
            Delete account
        </button>
    {/if}
</div>
