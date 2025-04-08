import { CldUploadWidget } from "next-cloudinary";

export default function AddProductModal({show, onClose}) {
	return (
		<div>
            <div>
                <CldUploadWidget uploadPreset="<Your Upload Preset>">
                    {({ open }) => {
                        return <button onClick={() => open()}>Upload an Image</button>;
                    }}
                </CldUploadWidget>
            </div>
		</div>
	);
}
