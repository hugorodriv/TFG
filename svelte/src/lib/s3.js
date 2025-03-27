import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME } from "$env/static/private";

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
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
 * @param {string | number} userId
 */
export function getUserPfpLink(userId) {
    return `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/pfp/${userId}.jpeg`;
}

/**
 * @param {Number | String} userId
 */
export async function uploadPresignedPfp(userId, contentType = 'image/jpeg') {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(contentType)) {
        throw new Error('Invalid file type');
    }

    // unique filename
    // const filename = `pfp/${userId}-${Date.now()}.${contentType.split('/')[1]}`;
    const filename = `pfp/${userId}.jpeg`;

    // Create S3 upload parameters
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
        const publicUrl = getUserPfpLink(userId)

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
