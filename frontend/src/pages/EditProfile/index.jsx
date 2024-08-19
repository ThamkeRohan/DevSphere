import { useEffect, useState } from "react"
import {useAsync, useAsyncFn} from "../../hooks/useAsync"
import { editUserProfile, getUserProfile } from "../../services/user"
import {uploadImage} from "../../services/uploadImage"
import {useAuth, useAuthUpdate} from "../../contexts/AuthContext"
import {useNavigate} from "react-router-dom"
import PageLoading from "../../components/PageLoading"
import Error from "../../components/Error"
import { PROFILE_FORM_MESSAGES } from "../../constants/formMessages"
import Toast from "../../components/Toast"

export default function EditProfile() {
    const loggedInUser = useAuth()
    const {updateLoggedInUser} = useAuthUpdate()
    const {loading, error, value, refresh} = useAsync(() => getUserProfile({userId: loggedInUser._id}), [])
    const uploadImageFn = useAsyncFn(uploadImage)
    const editUserProfileFn = useAsyncFn(editUserProfile)
    const [userProfile, setUserProfile] = useState()
    const navigate = useNavigate()
    useEffect(() => {
        if(value == null) return
        setUserProfile({
            name: value.name || "",
            bio: value.bio || "",
            profileImageUrl: value.profileImageUrl || "",
            gitHub: value.socialMedia?.gitHub || "",
            stackOverflow: value.socialMedia?.stackOverflow || "",
            linkedIn: value.socialMedia?.linkedIn || "",
            twitter: value.socialMedia?.twitter || "",
            website: value.website || "",
            location: value.location || ""
        })
    }, [value])
    function handleChange(e) {
        setUserProfile(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    function handleUploadImage(e) {
        const imageData = new FormData();
        imageData.append("file", e.target.files[0]);
        imageData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
        uploadImageFn.execute({ imageData }).then((data) => {
          setUserProfile(prev => ({...prev, profileImageUrl: data.secure_url}))
        });
    }
    function setSocialMedia(userProfile, platform, platformUrl) {
      if(userProfile.socialMedia == null) {
        userProfile.socialMedia = {}
      }
      userProfile.socialMedia[platform] = platformUrl
    }
    function handleSubmit(e) {
        e.preventDefault()
        const editedUserProfile = {}
        if(userProfile.name.trim().length > 0) {
            editedUserProfile.name = userProfile.name.trim()
        }
        if(userProfile.bio.trim().length > 0) {
            editedUserProfile.bio = userProfile.bio.trim()
        }
        if(userProfile.profileImageUrl.trim().length > 0) {
            editedUserProfile.profileImageUrl = userProfile.profileImageUrl.trim()
        }
        if(userProfile.website.trim().length > 0) {
            editedUserProfile.website = userProfile.website.trim()
        }
        if (userProfile.location.trim().length > 0) {
          editedUserProfile.location = userProfile.location.trim()
        }
        if (userProfile.gitHub.trim().length > 0) {
          setSocialMedia(editedUserProfile, "gitHub", userProfile.gitHub.trim())
        }
        if (userProfile.stackOverflow.trim().length > 0) {
          setSocialMedia(editedUserProfile, "stackOverflow", userProfile.stackOverflow.trim())
        }
        if (userProfile.linkedIn.trim().length > 0) {
          setSocialMedia(editedUserProfile, "linkedIn", userProfile.linkedIn.trim())
        }
        if (userProfile.twitter.trim().length > 0) {
          setSocialMedia(editedUserProfile, "twitter", userProfile.twitter.trim())
        }
    
        editUserProfileFn.execute({
          userId: loggedInUser._id,
          userProfile: editedUserProfile
        })
        .then(() => {
          updateLoggedInUser({
            name: userProfile.name,
            profileImageUrl: userProfile.profileImageUrl
          })
          navigate(`/users/${loggedInUser._id}/profile`, {state: {message: "Profile edited successfully"}})
        })

    }
    if(loading) {
      return <PageLoading/>
    }
    if(error) {
      return <Error message={error} onRefresh={refresh}/>
    }
    if(userProfile == null) {
      return null
    }
   
    return (
      <div className="edit-profile container-md">
        <h1 className="page-heading">Edit {userProfile.name} profile</h1>
        <form onSubmit={handleSubmit}>
          {editUserProfileFn.error && <div>{editUserProfileFn.error}</div>}

          <div className="user">
            <h3 className="text-lg-bold">User</h3>
            <div className="entry">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={userProfile.name}
                onChange={handleChange}
              />
              {userProfile.name.trim().length === 0 && (
                <div className="validation-message">
                  {PROFILE_FORM_MESSAGES.name}
                </div>
              )}
            </div>
            <div className="entry">
              <label htmlFor="profileImage">Profile Image</label>
              <div className="profile-image-entry">
                {userProfile.profileImageUrl && (
                  <div className="profile-image">
                    <img src={userProfile.profileImageUrl} />
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleUploadImage}
                  disabled={uploadImageFn.loading}
                />
              </div>
              {uploadImageFn.error && (
                <Toast
                  type="error"
                  message={uploadImageFn.error}
                  isClosable
                  onClose={uploadImageFn.clearError}
                />
              )}
            </div>
          </div>
          <div className="basic">
            <h3 className="text-lg-bold">Basic</h3>
            <div className="entry">
              <label htmlFor="website">Website</label>
              <input
                type="url"
                id="website"
                name="website"
                value={userProfile.website}
                onChange={handleChange}
              />
            </div>
            <div className="entry">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={userProfile.location}
                onChange={handleChange}
              />
            </div>
            <div className="entry">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={userProfile.bio}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <div className="social-media">
            <h3 className="text-lg-bold">Social Media</h3>
            <div className="entry">
              <label htmlFor="gitHub">GitHub</label>
              <input
                type="url"
                id="gitHub"
                name="gitHub"
                value={userProfile.gitHub}
                onChange={handleChange}
              />
            </div>
            <div className="entry">
              <label htmlFor="stackOverflow">Stack Overflow</label>
              <input
                type="url"
                id="stackOverflow"
                name="stackOverflow"
                value={userProfile.stackOverflow}
                onChange={handleChange}
              />
            </div>
            <div className="entry">
              <label htmlFor="linkedIn">LinkedIn</label>
              <input
                type="url"
                id="linkedIn"
                name="linkedIn"
                value={userProfile.linkedIn}
                onChange={handleChange}
              />
            </div>
            <div className="entry">
              <label htmlFor="twitter">Twitter</label>
              <input
                type="url"
                id="twitter"
                name="twitter"
                value={userProfile.twitter}
                onChange={handleChange}
              />
            </div>
          </div>
          <button
            className="btn btn-block btn-filled text-normal-bold"
            disabled={
              userProfile.name.trim().length === 0 || editUserProfileFn.loading
            }
          >
            Save Profile
          </button>
        </form>
      </div>
    );
}