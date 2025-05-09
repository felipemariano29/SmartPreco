import { UploadImageDto } from "./upload.dto";
import { UploadParams } from "./upload.interface";

export interface UploadStrategy {

  uploadImage(params: UploadParams): Promise<UploadImageDto>;

}