<script>
    import { onMount } from "svelte";
    import Bottombar from "../Bottombar.svelte";
    import Navbar from "../Navbar.svelte";

    import { locationStore } from "$lib/stores/location";

    import "leaflet/dist/leaflet.css";

    const MAX_POSTS = 10;
    const RADIUS = 10_000; //in meters

    /**
     * @type {HTMLDivElement}
     */
    let mapContainer;
    /**
     * @type {{ lat: any; lon: any; }}
     */
    let location;
    /**
     * @type {{ options: { zoomSnap: number; zoomDelta: number; }; attributionControl: { remove: () => void; }; on: (arg0: string, arg1: () => Promise<void>) => void; getBounds: () => any; eachLayer: (arg0: (layer: { remove: () => void; }) => void) => void; }}
     */
    let map;
    /**
     * @type {{ map: any; tileLayer: any; circle: any; latLng: any; Marker: any; divIcon: any; marker: any; default?: any; Bounds?: any; Browser?: any; CRS?: any; Canvas?: any; Circle?: any; CircleMarker?: any; Class?: any; Control?: any; DivIcon?: any; DivOverlay?: any; DomEvent?: any; DomUtil?: any; Draggable?: any; Evented?: any; FeatureGroup?: any; GeoJSON?: any; GridLayer?: any; Handler?: any; Icon?: any; ImageOverlay?: any; LatLng?: any; LatLngBounds?: any; Layer?: any; LayerGroup?: any; LineUtil?: any; Map?: any; Mixin?: any; Path?: any; Point?: any; PolyUtil?: any; Polygon?: any; Polyline?: any; Popup?: any; PosAnimation?: any; Projection?: any; Rectangle?: any; Renderer?: any; SVG?: any; SVGOverlay?: any; TileLayer?: any; Tooltip?: any; Transformation?: any; Util?: any; VideoOverlay?: any; bind?: any; bounds?: any; canvas?: any; circleMarker?: any; control?: any; extend?: any; featureGroup?: any; geoJSON?: any; geoJson?: any; gridLayer?: any; icon?: any; imageOverlay?: any; latLngBounds?: any; layerGroup?: any; point?: any; polygon?: any; polyline?: any; popup?: any; rectangle?: any; setOptions?: any; stamp?: any; svg?: any; svgOverlay?: any; tooltip?: any; transformation?: any; version?: any; videoOverlay?: any; noConflict?: () => any; }}
     */
    let L;
    /**
     * @type {any[]}
     */
    let relevantPosts;
    const placedCoords = [];
    /**
     * @type {any[]}
     */
    let localPostsCache = [];
    /**
     * @type {number | null | undefined}
     */
    let timeoutId = null;
    /**
     * @type {{ uuid: any; }}
     */
    let accountData;

    onMount(async () => {
        accountData = JSON.parse(localStorage.getItem("accData") || "{}");
        location = locationStore.getData();

        L = await import("leaflet");

        map = L.map(mapContainer, {
            zoomControl: false,
            zoomAnimation: false,
            fadeAnimation: false,
        }).setView([location.lat, location.lon], 15);
        map.options.zoomSnap = 0;
        map.options.zoomDelta = 0;
        // map.setMaxBounds(bounds);
        map.attributionControl.remove();

        L.tileLayer(
            "https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png",
            {
                minZoom: 8,
                maxZoom: 18,
            },
        ).addTo(map);

        L.circle([location.lat, location.lon], {
            radius: RADIUS,
            weight: 0,
            color: "black",
            fillOpacity: 0.15,
        }).addTo(map);

        map.on("moveend zoomend", async () => {
            const bounds = map.getBounds();
            await populateMapWithPosts(bounds);
        });

        // Bounds for displaying some results first map open
        let tBounds = L.latLng(location.lat, location.lon).toBounds(20_000);

        await populateMapWithPosts(tBounds);
    });

    /**
     * @param {any} post_uuid
     */
    function getPostLink(post_uuid) {
        const user_uuid = accountData?.uuid;
        const timestamp = Date.now();

        // Combine the data
        const data = {
            l: [location?.lat, location?.lon],
            u: user_uuid,
            t: timestamp,
            p: post_uuid,
        };

        // Convert to base64 encoding
        const encoded = btoa(JSON.stringify(data));

        // Generate the link
        return `/post/${encodeURIComponent(encoded)}`;
    }
    /**
     * @param {{ contains: (arg0: { lat: any; lng: any; }) => any; _northEast: any; _southWest: any; }} bounds
     */
    async function populateMapWithPosts(bounds) {
        relevantPosts = localPostsCache.filter(
            function (p) {
                const res = bounds.contains({ lat: p.lat, lng: p.lon });
                if (res && this.count <= MAX_POSTS) {
                    this.count += 1;
                    return true;
                }
                return false;
            },
            { count: 0 },
        );

        if (relevantPosts.length < MAX_POSTS) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            const missingPosts = MAX_POSTS - relevantPosts.length;
            const response = await fetch("/api/get-posts-within-distance", {
                method: "POST",
                body: JSON.stringify({
                    userPosition: {
                        lat: location.lat,
                        lng: location.lon,
                    },
                    bounds: { NE: bounds._northEast, SW: bounds._southWest },
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
                        (/** @type {{ post_uuid: any; }} */ newPost) =>
                            !localPostsCache.some(
                                (cachedPost) =>
                                    cachedPost.post_uuid === newPost.post_uuid,
                            ),
                    ),
                ];
                relevantPosts = [
                    ...relevantPosts,
                    ...body.posts.filter(
                        (/** @type {{ post_uuid: any; }} */ newPost) =>
                            !relevantPosts.some(
                                (
                                    /** @type {{ post_uuid: any; }} */ cachedPost,
                                ) => cachedPost.post_uuid === newPost.post_uuid,
                            ),
                    ),
                ];
            }
        }

        // Clear old posts
        map.eachLayer((/** @type {{ remove: () => void; }} */ layer) => {
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
                    window.location.href = getPostLink(p.post_uuid);
                });

                marker.addTo(map);
            });
    }
    function centerMap() {
        if (!location.lat || !location.lon) return;
        map?.flyTo(new L.LatLng(location?.lat, location?.lon), 15);
    }
    /**
     * @param {number} deg
     */
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    // Haversine distance formula. Probably unnecessary for such small distances...
    /**
     * @param {number} lat1
     * @param {number} lon1
     * @param {number} lat2
     * @param {number} lon2
     */
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
    /**
     * @param {number} lat
     * @param {number} lon
     * @param {any} uuid
     */
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
    <Navbar text={"Map"} />
    <div
        bind:this={mapContainer}
        class="py-2 mx-auto rounded-lg z-0 h-full max-h-[calc(100vh-100px)] w-full"
    ></div>

    <button
        on:click={centerMap}
        aria-label="center map"
        class="shadow-md rounded-full p-3 bg-gray-100 hover:bg-gray-200 cursor-pointer absolute bottom-24 right-12"
    >
        <svg class="text-gray-800 w-8 h-8" viewBox="0 0 512 512">
            <path
                stroke-width="1.5"
                fill="currentColor"
                d="M256 0c17.7 0 32 14.3 32 32l0 34.7C368.4 80.1 431.9 143.6 445.3 224l34.7 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-34.7 0C431.9 368.4 368.4 431.9 288 445.3l0 34.7c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-34.7C143.6 431.9 80.1 368.4 66.7 288L32 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l34.7 0C80.1 143.6 143.6 80.1 224 66.7L224 32c0-17.7 14.3-32 32-32zM128 256a128 128 0 1 0 256 0 128 128 0 1 0 -256 0zm128-80a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"
            /></svg
        >
    </button>
    <Bottombar mapActive={true} />
</div>
