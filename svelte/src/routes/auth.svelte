<script>
    import { SignIn } from "@auth/sveltekit/components";
    import { dev } from "$app/environment";
    let termsAccepted = false;
</script>

<p class="mt-10 text-center text-3xl">SHARELLOC</p>

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

                    {#if dev}
                        <div class="mt-10 text-center">
                            <button
                                type="button"
                                class="text-white bg-[#24292F] font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2"
                            >
                                <svg
                                    class="w-4 h-4 me-2"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                                <SignIn
                                    class=""
                                    provider="github"
                                    options={{ redirectTo: "/successfulLogin" }}
                                    >Signin with GitHub</SignIn
                                >
                            </button>
                        </div>
                    {/if}
                {:else}
                    <div class="mt-10 text-center">
                        <button
                            disabled
                            type="button"
                            class=" text-white bg-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
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

                    {#if dev}
                        <div class="mt-10 text-center">
                            <button
                                type="button"
                                class="text-white bg-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center me-2 mb-2"
                            >
                                <svg
                                    class="w-4 h-4 me-2"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                                <SignIn
                                    class=""
                                    provider="github"
                                    options={{ redirectTo: "/successfulLogin" }}
                                    >Signin with GitHub</SignIn
                                >
                            </button>
                        </div>
                    {/if}
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
                        class="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50"
                    />
                    <label
                        for="terms"
                        class="ml-4 ms-2 text-sm font-medium text-gray-900"
                        >I agree with the <a
                            href="/termsandconditions"
                            class="text-blue-600">terms and conditions</a
                        ><br />
                        and with the
                        <a href="/privacypolicy" class="text-blue-600"
                            >privacy policy</a
                        >
                    </label>
                </div>
            </div>
        </div>
    </div>
</section>
