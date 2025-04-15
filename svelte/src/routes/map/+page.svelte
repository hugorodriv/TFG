<script>
    import { onMount } from "svelte";
    import Bottombar from "../Bottombar.svelte";
    import Navbar from "../Navbar.svelte";

    let mapContainer;
    let location;

    onMount(async () => {
        location = JSON.parse(localStorage.getItem("location") || "null");
        const L = await import("leaflet");
        const bounds = L.latLng(location.lat, location.lon).toBounds(20000);

        const map = L.map(mapContainer, {
            zoomControl: false, // Disable zoom controls
        }).setView([location.lat, location.lon], 10);
        map.options.zoomSnap = 0;
        map.options.zoomDelta = 0;
        map.setMaxBounds(bounds);
        map.attributionControl.remove();

        L.tileLayer(
            "https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png",
            {
                minZoom: 10,
                maxZoom: 13,
            },
        ).addTo(map);

        L.circle([location.lat, location.lon], {
            radius: 10000,
            weight: 0,
            color: "rgb(37 99 235)",
            fillOpacity: 0.2,
        }).addTo(map);

        L.circle([location.lat, location.lon], {
            radius: 500,
            weight: 1,
            color: "rgb(37 99 235)",
            fillOpacity: 1,
        }).addTo(map);

        map.on("moveend zoomend", () => {
            const center = map.getCenter();
            const bounds = map.getBounds();
            const radius = center.distanceTo(bounds.getNorthEast()) * 0.8;

            console.log(center.lat, center.lng);
            console.log(radius);
        });
    });
</script>

<link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
    crossorigin=""
/>

<div class="h-screen flex flex-col">
    <Navbar />
    <div
        class="mt-5 mx-auto flex-1 overflow-hidden rounded-lg w-11/12"
        bind:this={mapContainer}
    ></div>
    <Bottombar mapActive={true} />
</div>
