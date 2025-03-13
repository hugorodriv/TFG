<script>
    import { signOut } from "@auth/sveltekit/client";
    import { page } from "$app/stores";
</script>

<p class="mt-10 text-center text-4xl">Signup</p>
<p class="mt-10 text-center text-1xl">
    About to create an account with Google account
    <strong>{$page.data.session?.user?.email}</strong>
</p>

<p class="text-center text-1xl">Do you want to continue?</p>
<div class="mt-5 text-center border w-20 flex m-auto">
    <button class=" m-auto" on:click={() => signOut()}>Log out</button>
</div>
