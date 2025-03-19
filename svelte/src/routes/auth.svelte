<script>
    import { SignIn } from "@auth/sveltekit/components";
</script>

<p class="mt-10 text-center text-3xl">Log in with google</p>
<div class="mt-5 text-center border w-30 flex m-auto">
    <SignIn
        class="bg-blue-500 text-white px-4 py-2 rounded"
        provider="google"
        options={{ redirectTo: "/successfulLogin" }}
    ></SignIn>
</div>
