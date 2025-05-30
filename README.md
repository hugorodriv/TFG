# **Sharelloc**

## What is this project

This is my final year project at UPF. Sharelloc is a social media application for photo sharing.

> Its main difference from others is that photos are **only viewable** if the user is within **10 km** of where the picture was posted.

This enables the sharing of cool, lesser-known activities or places in one's city or neighborhood without the risk of them getting inundated with tourists, thus ruining the very thing the user wanted to share.

## Technical Notes

- **Framework**: Built on top of **SvelteKit**
- **Database**: **PostGIS** (PostgreSQL-based)
- **Image storage**: Images stored on **AWS S3**
- **Hosting**: Hosted on a **Debian server**
- **Proxy**: Behind **Cloudflare** proxy
- **Reverse Proxy**: Managed by **NGINX**
- **Containers**: All processes run in **separate Docker containers**



