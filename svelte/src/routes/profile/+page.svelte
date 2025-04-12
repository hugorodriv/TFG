<script>
    import { enhance } from "$app/forms";
    import { onMount } from "svelte";

    import PictureCrop from "./pictureCrop.svelte";
    import Navbar from "../Navbar.svelte";
    import Bottombar from "../Bottombar.svelte";

    let loading = true;

    let selection = 0; // 1: pfp, 2: bio&name, 3:accDeletion
    let accountData;
    /**
     * @type {string | null}
     */
    let pfp;
    let nameTooShort = false;
    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData")) || null;
        pfp = localStorage.getItem("pfp");
        loading = false;
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
    let succesfullPfpChange = false;

    async function uploadPfp() {
        const response_changePfpUrl = await fetch(`/api/changePfp`);

        const data = await response_changePfpUrl.json();
        // console.log(data);
        if (!data.success) {
            // server side error
        }

        const myHeaders = new Headers({ "Content-Type": "image/*" });
        try {
            console.log(finalProfilePicture);
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

            const reader = new FileReader();
            reader.readAsDataURL(finalProfilePicture);
            reader.onloadend = function () {
                const base64data = reader.result;
                localStorage.setItem("pfp", base64data);
                pfp = base64data;
            };
            succesfullPfpChange = true;
        } catch (error) {
            alert("Error changing profile picture");
        }
    }

    async function removePfp() {
        const response_changePfpUrl = await fetch(`/api/removePfp`);

        try {
            const data = await response_changePfpUrl.json();
            succesfullPfpChange = true;

            // create default PFP
            const letter = accountData.name.slice(0, 1).toUpperCase();
            const svg = `
            <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                <circle cx="64" cy="64" r="64" fill="#007BFF"/>
                <text x="64" y="64" font-size="64" fill="white" font-family="sans-serif"
                    text-anchor="middle" dominant-baseline="central">
                    ${letter}
                </text>
            </svg>`;

            localStorage.setItem(
                "pfp",
                `data:image/svg+xml;base64,${btoa(svg)}`,
            );
        } catch (error) {
            alert("Error removing pfp");
        }
    }
</script>

{#if loading}
    <div class="mt-28 text-center">
        <svg
            class="inline w-8 h-8 text-gray-200 animate-spin fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
        >
            <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
            />
            <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
            />
        </svg>
    </div>
{:else}
    <Navbar />
    <p class="mt-10 text-center text-xl">Profile Settings</p>

    <div class="space-y-4 p-4 max-w-md m-auto">
        <!-- Static info: Email and username  -->
        <div class="mb-5">
            <label
                for="email-address-icon"
                class="block mb-2 font-medium text-gray-900">Email</label
            >
            <div class="relative">
                <div
                    class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none"
                >
                    <svg
                        class="w-4 h-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 16"
                    >
                        <path
                            d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"
                        />
                        <path
                            d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"
                        />
                    </svg>
                </div>
                <p
                    id="email-address-icon"
                    class="bg-gray-200 border border-gray-500 text-gray-900 rounded-lg block w-full ps-10 p-2.5"
                >
                    {email || ""}
                </p>
            </div>

            <label
                for="username-address-icon"
                class="block my-2 font-medium text-gray-900">Username</label
            >
            <div class="relative">
                <div
                    class="absolute inset-y-0 -start-1 flex items-center ps-3.5 pointer-events-none"
                >
                    <svg
                        class="w-6 h-6 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
                <p
                    id="username-address-icon"
                    class="bg-gray-200 border border-gray-500 text-gray-900 rounded-lg block w-full ps-10 p-2.5"
                >
                    @{accData.username || ""}
                </p>
            </div>
        </div>

        <button
            id="dropdownRadioButton"
            class="mt-5 w-full justify-center text-gray-900 bg-gray-200 font-medium rounded-lg px-5 py-2.5 text-center inline-flex items-center"
            on:click={() => {
                document
                    ?.getElementById("dropdownSettings")
                    ?.classList.toggle("hidden");
            }}
            >Settings
            <svg class="w-2.5 h-2.5 ml-3" fill="none" viewBox="0 0 10 6">
                <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 4 4 4-4"
                />
            </svg>
        </button>

        <!-- Dropdown menu -->
        <div
            id="dropdownSettings"
            class="hidden w-full z-40 text-center bg-white divide-y divide-gray-100 rounded-lg shadow-sm"
        >
            <ul class="py-2 text-sm">
                <li>
                    <button
                        class="w-full block px-4 py-2 hover:bg-gray-100"
                        on:click={() => {
                            selection = 1;

                            document
                                ?.getElementById("dropdownSettings")
                                ?.classList.add("hidden");
                        }}>Profile Picture</button
                    >
                </li>
                <li>
                    <button
                        class="w-full block px-4 py-2 hover:bg-gray-100"
                        on:click={() => {
                            selection = 2;

                            document
                                ?.getElementById("dropdownSettings")
                                ?.classList.add("hidden");
                        }}>Bio & Name</button
                    >
                </li>
                <li>
                    <button
                        class="w-full block px-4 py-2 hover:bg-gray-100"
                        on:click={() => {
                            selection = 3;

                            document
                                ?.getElementById("dropdownSettings")
                                ?.classList.add("hidden");
                        }}>Delete account</button
                    >
                </li>
            </ul>
        </div>

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

        <!-- Change profile picture -->
        {#if selection == 1}
            <label for="pfp" class="block mb-1 font-semibold">
                Profile Picture
            </label>

            {#if succesfullPfpChange}
                <h1>Successfully updated</h1>
                <h2>Refresh page to see changes</h2>
            {/if}
            {#if changingPfp && !succesfullPfpChange}
                <!-- New profile picture selected and cropped -->
                <div>
                    {#if finalProfilePicture}
                        <div class="text-center m-auto justify-center flex">
                            <img
                                class="drop-shadow-lg py-5"
                                alt="current profile"
                                src={URL.createObjectURL(finalProfilePicture)}
                            />
                        </div>

                        <div
                            class="w-full inline-flex shadow-xs text-center justify-center"
                        >
                            <button
                                type="button"
                                on:click={() => uploadPfp()}
                                class="bg-green-50 hover:bg-green-100 hover:text-green-700 w-full px-4 py-2 font-medium text-gray-900 border-gray-200 border rounded-lg"
                            >
                                Update
                            </button>
                        </div>
                    {:else}
                        <PictureCrop bind:finalProfilePicture />
                    {/if}
                </div>
            {:else if !succesfullPfpChange}
                <!-- Displaying current pfp and two buttons for either changing or deleting -->
                <div class="text-center m-auto justify-center flex">
                    <img
                        class="drop-shadow-lg py-5"
                        alt="current profile"
                        src={pfp}
                    />
                </div>

                {#if confirmRemovePfp}
                    <button
                        type="button"
                        on:click={removePfp}
                        class="w-full inline-flex shadow-xs text-center justify-center hover:bg-red-200 hover:text-red-700 px-4 py-2 font-medium text-gray-900 bg-red-100 border border-red-200 rounded-lg"
                    >
                        Remove
                    </button>
                {:else}
                    <div
                        class="w-full inline-flex shadow-xs text-center justify-center"
                    >
                        <button
                            type="button"
                            on:click={() => (changingPfp = true)}
                            class="hover:bg-blue-100 hover:text-blue-700 w-full px-4 py-2 font-medium text-gray-900 border-gray-200 border rounded-l-lg"
                        >
                            Change
                        </button>
                        <button
                            type="button"
                            on:click={() => (confirmRemovePfp = true)}
                            class="hover:bg-red-100 hover:text-red-700 max-w-24 px-4 py-2 font-medium text-gray-900 bg-red-50 border border-red-200 rounded-r-lg"
                        >
                            Remove
                        </button>
                    </div>
                {/if}
            {/if}
        {/if}

        <!-- Change user details  -->
        {#if selection == 2}
            {#if form?.success}
                <h1>Successfully updated</h1>
                <h2>Refresh page to see changes</h2>
            {/if}
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
                    <!-- Name input -->
                    <div>
                        <label
                            for="name-input"
                            class="block mb-2 font-medium text-gray-900"
                            >Name</label
                        >
                        <input
                            name="name"
                            value={accData.name}
                            id="name-input"
                            maxlength="20"
                            class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                        />
                    </div>

                    <!-- Bio input -->
                    <div>
                        <label
                            for="message"
                            class="block my-2 font-medium text-gray-900"
                            >Bio</label
                        >
                        <textarea
                            name="bio"
                            class="min-h-48 my-2 block p-2.5 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Write your bio"
                            maxlength="500">{accData.bio}</textarea
                        >
                    </div>

                    {#if detailsChanged && !nameTooShort}
                        <button
                            type="submit"
                            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 focus:outline-none"
                            >Update</button
                        >
                    {:else}
                        <button
                            type="button"
                            class="text-white bg-blue-400 cursor-not-allowed font-medium rounded-lg px-5 py-2.5 text-center"
                            disabled>Update</button
                        >
                    {/if}
                </form>
            {/if}
        {/if}

        {#if selection == 3}
            <p class="font-bold">Account deletion</p>
            {#if confirmAccountDeletionButton}
                <form method="POST" action="?/deleteAccount">
                    <button
                        type="submit"
                        class="text-white font-bold w-full inline-flex shadow-xs text-center justify-center hover:bg-red-900 px-4 py-2 bg-red-800 border border-red-200 rounded-lg"
                    >
                        Confirm delete account
                    </button>
                </form>
            {:else}
                <button
                    type="button"
                    on:click={() => {
                        confirmAccountDeletionButton = true;
                    }}
                    class="w-full inline-flex shadow-xs text-center justify-center hover:bg-red-200 hover:text-red-700 px-4 py-2 font-medium text-gray-900 bg-red-100 border border-red-200 rounded-lg"
                >
                    Delete account
                </button>
            {/if}
        {/if}

        <Bottombar />
    </div>
{/if}
