import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import s3 from "./S3Client";

export async function getSignedUrlForImage(key: string, expiresIn: number = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn });
  return signedUrl;
}
