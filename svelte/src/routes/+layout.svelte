<script>
    // loading bar
    import "nprogress/nprogress.css";
    import NProgress from "nprogress";
    import { navigating } from "$app/stores";
    import "../app.css";

    NProgress.configure({
        showSpinner: false,
    });
    let { children } = $props();

    $effect(() => {
        const unsubscribe = navigating.subscribe((nav) => {
            if (nav) NProgress.start();
            else NProgress.done();
        });
        return unsubscribe;
    });
</script>

{@render children()}
