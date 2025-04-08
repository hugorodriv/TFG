<script>
    import Bottombar from "../Bottombar.svelte";
    import Navbar from "../Navbar.svelte";
    import { onMount } from "svelte";
    import ProfileCard from "./ProfileCard.svelte";

    export let data;

    /**
     * @type {{ uuid: String; }}
     */
    let accountData;
    onMount(() => {
        accountData = JSON.parse(localStorage.getItem("accData") || "{}");
    });
</script>

<Navbar />

<div class="space-y-4 p-4 max-w-md m-auto">
    {#if data.pending.length > 0}
        <p class="mt-10 text-center text-xl">New friend requests</p>
    {/if}

    <div class="flow-root">
        <ul role="list" class="">
            {#each data.pending as p}
                <ProfileCard
                    name={p.sender_name}
                    username={p.sender_username}
                    img_url={p.sender_img_url}
                    sender_uuid={p.sender_uuid}
                    receiver_uuid={null}
                    acceptButton={true}
                />
            {/each}
        </ul>
    </div>

    {#if data.sentPending.length > 0}
        <p class="mt-10 text-center text-xl">Sent</p>
    {/if}

    <div class="flow-root">
        <ul role="list" class="">
            {#each data.sentPending as p}
                <ProfileCard
                    name={p.receiver_name}
                    username={p.receiver_username}
                    img_url={p.receiver_img_url}
                    sender_uuid={null}
                    receiver_uuid={p.receiver_uuid}
                />
            {/each}
        </ul>
    </div>
    {#if data.friendList}
        <p class="mt-10 text-center text-xl">Friend list</p>
        <div class="flow-root">
            <ul role="list" class="">
                {#each data.friendList as p}
                    <ProfileCard
                        name={p.friend_name}
                        username={p.friend_username}
                        img_url={p.friend_img_url}
                        sender_uuid={null}
                        receiver_uuid={p.friend_uuid}
                        isFriend={true}
                    />
                {/each}
            </ul>
        </div>
    {/if}
</div>

<Bottombar />
