<script>
    import { signOut } from "@auth/sveltekit/client";
    import { enhance } from "$app/forms";
    import Navbar from "../Navbar.svelte";

    export let data;
    const session = data.session;

    export let form;

    // dynamically check if username is used
    /**
     * @type {Number}
     */
    let delayTimer;
    let statusMessage = "";
    let usernameError = false;

    let usernameTooShort = true;
    let nameTooShort = true;

    function checkName(/** @type {String} */ name) {
        if (name.length < 1) {
            nameTooShort = true;
        } else {
            nameTooShort = false;
        }
    }
    const checkUsername = async (e) => {
        const username = e.target?.value.toLowerCase();

        //enforce lowercase client side
        e.target.value = username;

        clearTimeout(delayTimer);

        if (username.length < 4) {
            statusMessage = "";
            usernameTooShort = true;
            return;
        }
        usernameTooShort = false;
        // implement delay to not make too many requests
        delayTimer = setTimeout(async () => {
            try {
                const response = await fetch(
                    `/api/check-username?username=${encodeURIComponent(username)}`,
                );

                const data = await response.json();

                if (data.status === "available") {
                    statusMessage = "Username available";
                    usernameError = false;
                } else if (data.status === "invalid") {
                    statusMessage = "Username invalid";
                    usernameError = true;
                } else if (data.status === "unavailable") {
                    statusMessage = "Username already taken";
                    usernameError = true;
                } else {
                    statusMessage = "Server error";
                    usernameError = true;
                }
            } catch (error) {
                statusMessage = "Server error";
                usernameError = true;
            }
        }, 300); // 300ms delay
    };
</script>

<Navbar text={"Signup"} />
<div class="space-y-4 p-4 m-auto">
    <!-- Static info: Email -->
    <div class="bg-white py-5 px-5 rounded-lg shadow-lg">
        <label for="email" class="mt-2 block mb-2 font-medium text-gray-900"
            >Email</label
        >
        <div class="border-b-1 border-gray-300 pb-4 flex">
            <span
                class="inline-flex items-center px-3 text-gray-900 bg-gray-300 rounded-s-md"
            >
                <svg
                    class="w-4 h-4 text-gray-800"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-width="2"
                        d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
                    />
                </svg>
            </span>
            <p
                class="rounded-none rounded-e-lg bg-gray-300 border border-gray-300 text-gray-900 w-full py-2.5"
            >
                {session?.user?.email}
            </p>
        </div>

        <form method="POST" class="mt-5" use:enhance>
            <!-- Username input -->
            <div class="flex">
                <label for="username" class=" font-medium text-gray-900"
                    >Username</label
                >

                <!-- Username status (available, error, invalid ...) -->
                <div class="ml-5">
                    <p
                        id="usernameStatus"
                        class="{usernameError
                            ? 'text-red-800'
                            : 'text-green-800'} "
                    >
                        {statusMessage || "\u00A0"}
                    </p>
                </div>
            </div>
            <div class="flex">
                <span
                    class="inline-flex items-center px-3 text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md"
                >
                    <p>@</p>
                </span>
                <input
                    maxlength="20"
                    minlength="4"
                    name="username"
                    type="text"
                    on:keyup={(e) => checkUsername(e)}
                    required
                    class="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 w-full p-2.5"
                    placeholder="username"
                />
            </div>

            <!-- Name input -->
            <div class="">
                <label
                    for="website-admin"
                    class="mt-2 block mb-2 font-medium text-gray-900"
                    >Name</label
                >
                <div class="flex">
                    <span
                        class="inline-flex items-center px-3 text-gray-900 bg-gray-200 border border-e-0 border-gray-300 rounded-s-md"
                    >
                        <svg
                            class="w-4 h-4 text-gray-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"
                            />
                        </svg>
                    </span>
                    <input
                        maxlength="50"
                        minlength="1"
                        name="name"
                        on:keyup={(e) => checkName(e.target?.value)}
                        required
                        class="rounded-none rounded-e-lg bg-gray-50 border border-gray-300 text-gray-900 w-full p-2.5"
                        placeholder="Name"
                    />
                </div>
            </div>

            {#if form?.error}
                <h1>Error creating account. Try again</h1>
            {/if}

            <div
                class="mt-12 w-full inline-flex shadow-xs text-center justify-center"
            >
                {#if !usernameError && !usernameTooShort && !nameTooShort}
                    <button
                        type="submit"
                        class="bg-green-50 hover:bg-blue-100 hover:text-blue-700 w-full px-4 py-2 font-medium text-gray-900 border-gray-200 border rounded-l-lg"
                    >
                        Register
                    </button>
                {:else}
                    <button
                        disabled
                        class=" hover:bg-blue-100 hover:text-blue-700 w-full px-4 py-2 font-medium text-gray-900 border-gray-200 border rounded-l-lg"
                    >
                        Register
                    </button>
                {/if}
                <button
                    type="button"
                    on:click={() => {
                        signOut().then(() => {
                            window.location.href = "/";
                        });
                    }}
                    class="hover:bg-red-100 hover:text-red-700 max-w-24 px-4 py-2 font-medium text-gray-900 bg-red-50 border border-red-200 rounded-r-lg"
                >
                    Cancel
                </button>
            </div>
        </form>
    </div>
</div>
