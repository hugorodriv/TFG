<script>
    import { SignIn } from "@auth/sveltekit/components";
    let termsAccepted = false;
</script>

<p class="mt-10 text-center text-3xl">TFG</p>

<div class="mt-5 text-center justify-center"></div>

<section class="justify-center bg-gray-50">
    <div class="flex flex-col items-center justify-center px-6 py-8">
        <div class="w-full bg-white rounded-lg shadow">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1
                    class="justify-center text-center text-xl font-bold leading-tight tracking-tight text-gray-900"
                >
                    Sign in to your account
                </h1>

                {#if termsAccepted}
                    <div class="mt-10 text-center">
                        <button
                            type="button"
                            class=" text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
                        >
                            <svg
                                class="w-4 h-4 me-2"
                                fill="currentColor"
                                viewBox="0 0 18 19"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            <SignIn
                                class=""
                                provider="google"
                                options={{ redirectTo: "/successfulLogin" }}
                                >Signin with google</SignIn
                            >
                        </button>
                    </div>
                {:else}
                    <div class="mt-10 text-center">
                        <button
                            disabled
                            type="button"
                            class=" text-white bg-blue-300 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
                        >
                            <svg
                                class="w-4 h-4 me-2"
                                fill="currentColor"
                                viewBox="0 0 18 19"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            <p>Signin with google</p>
                        </button>
                    </div>
                {/if}

                <div
                    class="text-center justify-center mt-10 flex items-center h-5"
                >
                    <input
                        id="terms"
                        type="checkbox"
                        on:click={(e) => {
                            termsAccepted = e.target.checked;
                        }}
                        value=""
                        class="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                        required
                    />
                    <label
                        for="terms"
                        class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >I agree with the <a
                            href="/termsandconditions"
                            class="text-blue-600">terms and conditions</a
                        ></label
                    >
                </div>
            </div>
        </div>
    </div>
</section>
