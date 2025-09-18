import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "./S3Client";

export async function uploadToS3(file: Express.Multer.File, key: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3.send(command);

  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}
