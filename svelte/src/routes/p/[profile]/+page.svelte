<script>
    import Bottombar from "../../Bottombar.svelte";
    import Navbar from "../../Navbar.svelte";
    import { onMount } from "svelte";

    export let data;
    let accountData;

    let userNotFound = true;
    let isOwnProfile = false;
    const profile = data.userdata;
    const friendshipStatus = data.friendshipStatus;
    /**
     * @type {string}
     */
    let image_data;
    let requestSent = false;

    /**
     * @param {String} uuid
     */
    async function sendFriendRequest(uuid) {
        const response = await fetch("../api/send-friend-request", {
            method: "POST",
            body: JSON.stringify({ uuid }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const body = await response.json();
        if (body.success) {
            requestSent = true;
        }
    }

    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData") || "{}");

        if (data.success && profile) {
            userNotFound = false;

            if (profile.username == accountData?.username) {
                isOwnProfile = true;
                image_data = localStorage.getItem("pfp") || "";
            } else {
                // if no img data, create blue bg and white letter (default pfp)
                const letter = profile.name.slice(0, 1).toUpperCase();
                const svg = `
                <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="64" cy="64" r="64" fill="#007BFF"/>
                    <text x="64" y="64" font-size="64" fill="white" font-family="sans-serif"
                        text-anchor="middle" dominant-baseline="central">
                        ${letter}
                    </text>
                </svg>`;

                image_data = `data:image/svg+xml;base64,${btoa(svg)}`;
                if (profile.img_url) {
                    (async () => {
                        try {
                            const response = await fetch(profile.img_url);
                            if (!response.ok)
                                throw new Error("Failed to fetch image");

                            const blob = await response.blob();

                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = function () {
                                const base64data = String(reader.result);

                                image_data = base64data;
                            };
                        } catch (error) {
                            console.error("Error fetching image:", error);
                        }
                    })().then(() => {});
                }
            }
        } else {
            const letter = "?";
            const svg = `
            <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                <circle cx="64" cy="64" r="64" fill="#cad5e2"/>
                <text x="64" y="64" font-size="64" fill="black" font-family="sans-serif"
                    text-anchor="middle" dominant-baseline="central">
                    ${letter}
                </text>
            </svg>`;

            image_data = `data:image/svg+xml;base64,${btoa(svg)}`;
        }
    });
</script>

<Navbar />
<div class="space-y-4 p-4 max-w-md m-auto">
    {#if userNotFound}
        <div class="border border-gray-200 rounded-lg shadow-sm">
            <div class="mt-10 flex flex-col items-center pb-10">
                <img
                    class="drop-shadow-lg w-24 h-24 mb-3 rounded-full shadow-lg"
                    src={image_data}
                    alt="pfp"
                />
                <p class="my-5 text-xl font-medium text-gray-900">
                    User not found
                </p>
            </div>
        </div>
    {:else}
        <div class="border border-gray-200 rounded-lg shadow-sm">
            <div class="mt-10 flex flex-col items-center pb-10">
                <img
                    class="drop-shadow-lg w-24 h-24 mb-3 rounded-full shadow-lg"
                    src={image_data}
                    alt="pfp"
                />
                <p class="mb-1 text-xl font-medium text-gray-900">
                    {profile.name}
                </p>
                <p class="text-sm text-gray-500">
                    @{profile.username}
                </p>
                <p class="mt-2 px-5 text-sm text-gray-600">
                    {profile.bio}
                </p>

                {#if !isOwnProfile}
                    <!-- If friendship status null  -->
                    {#if !friendshipStatus}
                        {#if !requestSent}
                            <button
                                type="button"
                                class="mt-4 text-white bg-blue-600 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2"
                                on:click={async () => {
                                    await sendFriendRequest(profile.uuid);
                                }}
                            >
                                <svg
                                    class="w-6 h-6 text-white"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H7Zm8-1a1 1 0 0 1 1-1h1v-1a1 1 0 1 1 2 0v1h1a1 1 0 1 1 0 2h-1v1a1 1 0 1 1-2 0v-1h-1a1 1 0 0 1-1-1Z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                                Add friend
                            </button>
                        {:else}
                            <p
                                class="text-gray-800 text-sm px-5 py-2.5 text-center inline-flex items-center me-2"
                            >
                                Request sent
                            </p>
                        {/if}
                    {:else if friendshipStatus === "PENDING"}
                        <p
                            class="text-gray-800 text-sm px-5 py-2.5 text-center inline-flex items-center me-2"
                        >
                            Friend request pending
                        </p>
                    {:else if friendshipStatus === "ACCEPTED"}
                        <p
                            class="text-gray-800 text-sm px-5 py-2.5 text-center inline-flex items-center me-2"
                        >
                            Already friends :)
                        </p>
                    {/if}
                {:else}
                    <div class="flex mt-4 md:mt-6">
                        <a
                            href="/profile"
                            class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-600 rounded-lg hover:bg-blue-800"
                            >Edit profile</a
                        >
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>
<Bottombar />
