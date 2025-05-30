# **Sharelloc**


🔗 Visit the site and take a look: [Sharelloc](https://sharelloc.app)

## What is this project

This is my final year project at UPF. Sharelloc is a social media application for photo sharing.

> Its main difference from others is that photos are **only viewable** if the user is within **10 km** of where the picture was posted.

This enables the sharing of cool, lesser-known activities or places in one's city or neighborhood without the risk of them getting inundated with tourists, thus ruining the very thing the user wanted to share.

## Technical Notes

- **Framework**: Built on top of SvelteKit
- **Database**: PostGIS (PostgreSQL-based)
- **Image storage**: AWS S3
- **Hosting**: Hosted on a Debian server
- **Proxy**: Behind Cloudflare proxy
- **Reverse Proxy**: Managed by NGINX
- **Containers**: All processes are Dockerized

## Paper abstract

>The state of the web since the early days of Web 2.0, when the first social media platforms started to become widespread, has changed a lot, and is continuing to do so.
>Countless tools and techniques have appeared since, and changed the way Websites and WebApps work, completely changing the state of the art from just a couple of years ago.
>
>In the following pages I will share my approach to the development from scratch of a fully fledged social media platform, the decisions I made, and what I have learned.
>
>My motivation for such a project is that in these four years of C.S. Engineering at UPF we have explored many techniques, technologies, and processes, both on a practical and theoretical level, but we lack the complete experience of the development of a new product. 
>This is a typical expectation for newly graduated engineers and reflects the kind of work many of us will undertake professionally in the coming years.
>
>The result is a complete social media platform, live for everyone to use, with a distinct personality that aims to connect people and neighborhoods together.



