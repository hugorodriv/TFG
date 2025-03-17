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

    const checkUsername = async (/** @type {String} */ username) => {
        clearTimeout(delayTimer);

        if (username.length < 2) {
            statusMessage = "";
            return;
        }
        // Set a new timer
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
                value={form?.username}
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
