import { UploadImageDto } from "@modules/upload/upload.dto";
import { UploadParams } from "@modules/upload/upload.interface";

export interface UploadStrategy {

  uploadImage(params: UploadParams): Promise<UploadImageDto>;

}