import FormWrapper from "./FormWrapper"
import { uploadImage } from "../../services/uploadImage"
import { useAsyncFn } from "../../hooks/useAsync";

export default function UserForm({profileImageUrl, bio, updateProfileImageUrl, updateBio}) {  
  const uploadImageFn = useAsyncFn(uploadImage)
    async function handleImageSelect(e) {
        if(e.target.files == null || e.target.files.length === 0) {
          updateProfileImageUrl(null)
          return
        }
        const imageData = new FormData()
        imageData.append("file", e.target.files[0])
        imageData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET)
        uploadImageFn.execute({ imageData }).then((data) => {
          updateProfileImageUrl(data.secure_url)
        })
    }

    return (
      <FormWrapper
        title="Build your profile"
        description="Tell us a little about yourself - this is how others will see you on DEV Community. You'll always be able to edit this later in your Settings."
      >
        <div className="entry">
          <div className="profile-image">
            <img src={profileImageUrl} alt="profile-image" />
          </div>
          <label htmlFor="profile-image">Profile Image</label>
          <input type="file" id="profile-image" disabled={uploadImageFn.loading} onChange={handleImageSelect}/>
          {uploadImageFn.error && <div>{uploadImageFn.error}</div>}
        </div>
        <div className="entry">
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" value={bio} onChange={e => updateBio(e.target.value)} className={bio.length > 200 ? "invalid" : ""}></textarea>
        </div>
      </FormWrapper>
    );
}