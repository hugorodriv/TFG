<div class="w-11/12 m-auto rounded-lg pb-14">
    <button
        on:click={() => {
            document
                .getElementById("accordion-collapse-body")
                ?.toggleAttribute("hidden");

            document
                .getElementById("arrowIcon")
                ?.classList.toggle("rotate-180");
        }}
        type="button"
        class="bg-white flex items-center justify-between w-full p-5 font-medium
                text-gray-600 border border-gray-300 rounded-lg
                gap-3"
    >
        <span>What is sharelloc?</span>
        <svg
            id="arrowIcon"
            class="w-3 h-3 rotate-180 shrink-0"
            fill="none"
            viewBox="0 0 10 6"
        >
            <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5 5 1 1 5"
            />
        </svg>
    </button>
    <div hidden id="accordion-collapse-body">
        <div
            class="mt-2 bg-white text-gray-500 space-y-4 p-5 rounded-lg shadow-lg border border-gray-300"
        >
            <p>
                Sharelloc is my Final Year Project. It's a social media that
                allows users to post location-tied pictures and explore posts
                from others that are closed to them.
            </p>
            <p>
                You can follow your friends and visit their profiles to always
                keep up with what they are posting, or you can go in the explore
                or map pages to see what users close to you are posting :)
            </p>
            <p>
                Post things about your city that you find interesting and share
                it with locals!
            </p>
            <p>
                The code will be open sourced and available in <a
                    class="underline text-blue-500"
                    href="https://github.com/hugorodriv/TFG">Github</a
                >
            </p>
        </div>
    </div>
</div>
