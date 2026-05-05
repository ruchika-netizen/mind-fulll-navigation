import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserAndProfile();
  }, []);


  const getUserAndProfile = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    setUser(user);

    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
        });
      }
    }

    setLoading(false);
  };


  const handleSave = async () => {
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: profile.full_name,
      phone: profile.phone,
      updated_at: new Date(),
    });

    if (error) {
      alert("Error saving profile");
    } else {
      alert("Profile updated");
      setEditing(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6">User Profile</h1>
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-2xl">
            {profile.full_name
              ? profile.full_name.charAt(0).toUpperCase()
              : user?.email?.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="font-semibold">{user?.email}</p>
          </div>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-gray-500">Full Name</label>
            {editing ? (
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
                className="w-full border p-2 rounded-lg mt-1"/>
            ) : (
              <p className="font-medium">
                {profile.full_name || "Not set"}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-gray-500">Phone</label>
            {editing ? (
              <input
                type="text"
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="w-full border p-2 rounded-lg mt-1"/>
            ) : (
              <p className="font-medium">
                {profile.phone || "Not set"}
              </p>
            )}
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="text-gray-500">Email</label>
            <p className="font-medium">{user?.email}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded-lg">
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="border px-4 py-2 rounded-lg">
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;