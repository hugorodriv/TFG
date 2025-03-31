<script>
    import { signOut } from "@auth/sveltekit/client";
    import { enhance } from "$app/forms";

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
    const checkUsername = async (/** @type {String} */ username) => {
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
            <div class="ml-3 font-extralight">
                {#if usernameError}
                    <p class="text-red-800" id="usernameStatus">
                        {statusMessage}
                    </p>
                {:else}
                    <p class="text-green-800" id="usernameStatus">
                        {statusMessage}
                    </p>
                {/if}
            </div>
        </div>
        <div class="relative">
            <input
                maxlength="20"
                name="username"
                type="text"
                class="w-full border p-2 rounded pl-7"
                placeholder="username"
                on:keyup={(e) => checkUsername(e.target?.value)}
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
        <label for="name" class="block mb-1 font-semibold">Name</label>
        <input
            name="name"
            placeholder="Name"
            class="w-full border p-2 rounded"
            maxlength="50"
            on:keyup={(e) => checkName(e.target?.value)}
        />
    </div>

    {#if !usernameError && !usernameTooShort && !nameTooShort}
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">
            Create Account
        </button>
    {:else}
        <button
            type="submit"
            disabled
            class="bg-gray-500 text-white px-4 py-2 rounded"
        >
            Create Account
        </button>
    {/if}

    {#if form?.error}
        <h1>Error creating account. Try again</h1>
    {/if}
</form>
