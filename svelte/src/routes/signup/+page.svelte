<script>
    import { signOut } from "@auth/sveltekit/client";
</script>

<p class="mt-10 text-center text-4xl">Signup</p>

<button on:click={() => signOut()}>Log out</button>
