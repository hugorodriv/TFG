import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME } from "$env/static/private";

import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Configure AWS S3 Client
const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    }
});

/**
 * @param {string} uuid
 */
export function getUserPfpLink(uuid) {
    return `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/pfp/${uuid}.jpeg`;
}

/**
 * @param {String} uuid
 */
export async function uploadPresignedPfp(uuid, contentType = 'image/jpeg') {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(contentType)) {
        throw new Error('Invalid file type');
    }

    // unique filename
    const filename = `pfp/${uuid}.jpeg`;


    const uploadParams = {
        Bucket: S3_BUCKET_NAME,
        Key: filename,
        ContentType: "image/jpg"
    };

    try {

        const uploadUrl = await getSignedUrl(
            s3Client,
            new PutObjectCommand(uploadParams),
            { expiresIn: 60 } // expires in 1 minute
        );

        // bucket, in this case, is public, as these are for users pfps, which everybody can see
        const publicUrl = getUserPfpLink(uuid)

        return {
            uploadUrl,
            publicUrl,
            filename
        };
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        throw new Error('Failed to generate upload URL');
    }
}


/**
 * @param {string} uuid
 */
export async function removePfpS3(uuid) {

    const filename = `pfp/${uuid}.jpeg`
    const delParams = {
        Bucket: S3_BUCKET_NAME,
        Key: filename,
    };


    try {
        await s3Client.send(new DeleteObjectCommand(delParams));
        return { success: true }
    } catch (e) {
        return { error: e }
    }
}

/**
 * @param {String} post_uuid
 */
export async function getPrivateLinkPost(post_uuid) {
    return `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/posts/${post_uuid}.jpeg`;
}


/**
 * @param {String} post_uuid
 */
export async function getUploadPostLink(post_uuid) {
    // unique filename
    const filename = `posts/${post_uuid}.jpeg`;


    const uploadParams = {
        Bucket: S3_BUCKET_NAME,
        Key: filename,
        ContentType: "image/jpg"
    };

    try {
        const uploadUrl = await getSignedUrl(
            s3Client,
            new PutObjectCommand(uploadParams),
            { expiresIn: 120 } // expires in 2 minutes
        );

        return {
            uploadUrl,
        };
    } catch (error) {
        console.error('Error generating pre-signed URL:', error);
        throw new Error('Failed to generate upload URL');
    }
}

const getTruncatedHourTime = () => {
    const d = new Date();
    d.setMinutes(0);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
};

/**
 * @param {String[]} post_uuid_arr
 */
export async function getViewableLinks(post_uuid_arr) {
    if (!post_uuid_arr) {
        return
    }


    const truncatedTime = getTruncatedHourTime();

    const links = await Promise.all(
        post_uuid_arr.map(async (uuid) => {
            const params = {
                Bucket: S3_BUCKET_NAME,
                Key: `posts/${uuid}.jpeg`,
                ResponseCacheControl: 'public, max-age=3600',
                ResponseContentType: 'image/jpeg'
            };

            const url = await getSignedUrl(
                s3Client,
                new GetObjectCommand(params),
                {
                    expiresIn: 7200,
                    signingDate: truncatedTime
                }
            );
            return url;
        })
    );

    return links;
}

/**
 * @param {String} post_uuid
 */
export async function removePostS3(post_uuid) {
    const filename = `posts/${post_uuid}.jpeg`
    const delParams = {
        Bucket: S3_BUCKET_NAME,
        Key: filename,
    };


    try {
        await s3Client.send(new DeleteObjectCommand(delParams));
        return { success: true }
    } catch (e) {
        return { error: e }
    }
}
