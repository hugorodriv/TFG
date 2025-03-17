<script>
    import { SignIn, SignOut } from "@auth/sveltekit/components";
    import { page } from "$app/stores";
</script>

<p class="text-center text-3xl">Log in with google</p>
<div class="mt-5 text-center border w-30 flex m-auto">
    <SignIn provider="google" />
</div>
