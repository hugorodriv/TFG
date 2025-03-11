<script>
    import { SignIn, SignOut } from "@auth/sveltekit/components";
    import { page } from "$app/stores";
    console.log($page.data);
</script>

<p class="mt-10 text-center text-4xl">Log in with google</p>
<div class="p-10">
    <SignIn class="border-1" provider="google" />
</div>
