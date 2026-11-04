import * as ImagePicker from "expo-image-picker";
/*
 * Expo SDK 54+: the classic API lives in "expo-file-system/legacy".
 * Expo SDK 52/53: change this line to  import * as FileSystem from "expo-file-system";
 */
import * as FileSystem from "expo-file-system/legacy";
import { petcardApi } from "./petcardApi";

export type UploadedPhoto = { publicId: string; width: number; height: number; format: string };

/**
 * Opens the system photo picker (no media-library permission needed), uploads the
 * chosen image straight to Cloudinary with a server-signed request, and returns the
 * result to send to the backend. Returns null when the user cancels.
 *
 * The file is sent with FileSystem.uploadAsync (native multipart upload). The old
 * `form.append("file", { uri, name, type })` trick throws
 * "Unsupported FormDataPart implementation" on newer Expo versions.
 */
export async function pickAndUploadPhoto(
  purpose: "user_photo" | "pet_photo" | "memory",
  petId?: string,
  options: { crop?: boolean } = {}
): Promise<UploadedPhoto | null> {
  const picked = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: options.crop !== false,
    ...(options.crop !== false ? { aspect: [1, 1] as [number, number] } : {}),
    quality: 0.8,
  });
  if (picked.canceled || !picked.assets?.[0]) return null;
  const asset = picked.assets[0];

  const { upload } = await petcardApi.signUpload(purpose, petId);

  // Cloudinary needs exactly the signed params (plus api_key + signature); all values as strings.
  const parameters: Record<string, string> = {
    api_key: upload.apiKey,
    signature: upload.signature,
  };
  Object.entries(upload.params).forEach(([key, value]) => {
    parameters[key] = String(value);
  });

  const result = await FileSystem.uploadAsync(upload.uploadUrl, asset.uri, {
    httpMethod: "POST",
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    fieldName: "file",
    mimeType: asset.mimeType ?? "image/jpeg",
    parameters,
  });

  let json: any = null;
  try {
    json = JSON.parse(result.body);
  } catch {
    json = null;
  }
  if (result.status < 200 || result.status >= 300 || !json?.public_id) {
    throw new Error(json?.error?.message || "Photo upload failed. Please try again.");
  }
  return {
    publicId: json.public_id as string,
    width: json.width as number,
    height: json.height as number,
    format: json.format as string,
  };
}