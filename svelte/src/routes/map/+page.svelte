<script>
    import { onMount } from "svelte";
    import Bottombar from "../Bottombar.svelte";
    import Navbar from "../Navbar.svelte";

    import "leaflet/dist/leaflet.css";
    import "leaflet.markercluster/dist/MarkerCluster.css";
    import "leaflet.markercluster/dist/MarkerCluster.Default.css";

    const MAX_POSTS = 5;
    const RADIUS = 10_000; //in meters

    let mapContainer;
    let location;
    let map;
    let L;
    let relevantPosts;
    const placedCoords = [];
    let localPostsCache = [];

    let timeoutId = null;
    onMount(async () => {
        location = JSON.parse(localStorage.getItem("location") || "null");

        L = await import("leaflet");
        // const bounds = L.latLng(location.lat, location.lon).toBounds(50_000);

        map = L.map(mapContainer, {
            zoomControl: false,
        }).setView([location.lat, location.lon], 10);
        map.options.zoomSnap = 0;
        map.options.zoomDelta = 0;
        // map.setMaxBounds(bounds);
        map.attributionControl.remove();

        L.circle([location.lat, location.lon], {
            radius: RADIUS,
            weight: 0,
            color: "rgb(37 99 235)",
            fillOpacity: 0.2,
        }).addTo(map);

        L.tileLayer(
            "https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png",
            {
                minZoom: 8,
                maxZoom: 18,
            },
        ).addTo(map);

        map.on("moveend zoomend", async () => {
            const center = map.getCenter();

            const mapBoundNorthEast = map.getBounds().getNorthEast();
            const radius = mapBoundNorthEast.distanceTo(map.getCenter()) * 0.7;

            await populateMapWithPosts(center, radius);
        });

        await populateMapWithPosts(
            { lat: location.lat, lng: location.lon },
            RADIUS,
        );
    });
    async function populateMapWithPosts(center, radius) {
        relevantPosts = localPostsCache.filter((p, index) => {
            if (index > MAX_POSTS) {
                return false;
            }
            const distanceWithUser = getDistance(
                center.lat,
                center.lng,
                p.lat,
                p.lon,
            );
            if (distanceWithUser <= radius) {
                return true;
            }
            return false;
        });

        if (relevantPosts.length < MAX_POSTS) {
            if (timeoutId) {
                clearTimeout(timeoutId); // Clear the existing timeout
            }

            console.log("requesting more");
            const missingPosts = MAX_POSTS - relevantPosts.length;
            const response = await fetch("./api/get-posts-within-distance", {
                method: "POST",
                body: JSON.stringify({
                    userPosition: {
                        lat: location.lat,
                        lng: location.lon,
                    },
                    reqCenter: center,
                    reqRadius: radius,
                    number: missingPosts,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const body = await response.json();
            if (!body || !body.posts) {
                return;
            }
            if (body.success && body.posts.length > 0) {
                localPostsCache = [
                    ...localPostsCache,
                    ...body.posts.filter(
                        (newPost) =>
                            !localPostsCache.some(
                                (cachedPost) =>
                                    cachedPost.post_uuid === newPost.post_uuid,
                            ),
                    ),
                ];
                relevantPosts = [
                    ...relevantPosts,
                    ...body.posts.filter(
                        (newPost) =>
                            !relevantPosts.some(
                                (cachedPost) =>
                                    cachedPost.post_uuid === newPost.post_uuid,
                            ),
                    ),
                ];
            }
        }

        // Clear old posts
        map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                layer.remove();
            }
        });

        relevantPosts
            .sort((a, b) => a.post_uuid.localeCompare(b.post_uuid))
            .forEach((p) => {
                const [adjLat, adjLon] = adjustIfOverlapping(
                    p.lat,
                    p.lon,
                    p.post_uuid,
                );
                const html = `
                <div style="
                    transition: fade-in;
                    width: 64px;
                    border: 1px solid #e5e7eb;
                    background: white;
                    border-radius: 0.5rem;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    cursor: pointer;
                ">
                <img 
                src="${p.img_url}" 
                style="width: 100%; height: 128; object-fit: cover;" 
                alt="Post"
                />
                </div>
                `;

                const zIndex = parseInt(p.post_uuid.slice(0, 8), 16) % 1000;

                const icon = L.divIcon({
                    html,
                    className: "",
                    iconAnchor: [32, 64],
                });

                const marker = L.marker([adjLat, adjLon], {
                    icon,

                    zIndexOffset: zIndex, // Apply the zIndex offset based on post_uuid
                }).on("click", () => {
                    window.location.href = p.post_url;
                });

                marker.addTo(map);
            });
    }
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Haversine distance formula. Probably unnecessary for such small distances...
    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371000; // Redius of the earth. Assuming a perfect sphere
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) *
                Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
    }

    // We dont want posts to perfectly overlap.
    // If we move them around randomly that would be inconsistant accross page renders
    // so we can take a hash of the UUID. a simple one would do
    function adjustIfOverlapping(lat, lon, uuid) {
        const threshold = 0.0001;

        const hash = [...uuid].reduce(
            (acc, char) => acc + char.charCodeAt(0),
            0,
        );
        const offsetLat = ((hash % 10) - 5) * threshold;
        const offsetLon = (((hash >> 3) % 10) - 5) * threshold;

        const adjustedLat = lat + offsetLat;
        const adjustedLon = lon + offsetLon;

        placedCoords.push([adjustedLat, adjustedLon]);
        return [adjustedLat, adjustedLon];
    }
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

<style>
</style>
