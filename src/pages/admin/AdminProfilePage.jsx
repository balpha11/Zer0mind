// src/pages/AdminProfilePage.jsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Camera, Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";

/* ------------------------------------------------------------- */
/*  Helper: extract “sub” (email) from the stored JWT             */
/* ------------------------------------------------------------- */
const extractEmailFromToken = () => {
  const token = localStorage.getItem("admin_token");
  if (!token) return "";
  try {
    const [, payloadBase64] = token.split(".");
    const payloadJson = atob(payloadBase64);
    const { sub } = JSON.parse(payloadJson); // “sub” = email in our token
    return sub || "";
  } catch {
    return "";
  }
};

const AdminProfilePage = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  /* ----------------------------------------------------------- */
  /*  Initialise profile data from token                         */
  /* ----------------------------------------------------------- */
  const initialProfile = {
    name: "",                               // empty for now
    email: extractEmailFromToken(),
    phone: "",                              // empty for now
    role: "Administrator",
    joinedDate: "—",                        // optional placeholder
    avatar: "https://github.com/shadcn.png",
  };

  const [profileData, setProfileData] = useState(initialProfile);
  const [formData, setFormData] = useState(initialProfile);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setProfileData(formData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  /* ----------------------------------------------------------- */
  /*  In case the token changes (e.g., after relogin)            */
  /* ----------------------------------------------------------- */
  useEffect(() => {
    setProfileData((prev) => ({ ...prev, email: extractEmailFromToken() }));
    setFormData((prev) => ({ ...prev, email: extractEmailFromToken() }));
  }, []);

  return (
    <>
      <div className="flex items-center justify-between space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Profile Overview */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Manage your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={profileData.avatar}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover"
                />
                {isEditing && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-semibold">
                  {profileData.name || "—"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {profileData.role}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    <User className="mr-2 inline-block h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="(empty)"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="mr-2 inline-block h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="mr-2 inline-block h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="(empty)"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex space-x-2">
                <Button onClick={handleSave}>Save Changes</Button>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Your account information and status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Member Since</span>
                <span className="text-sm text-muted-foreground">
                  {profileData.joinedDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Role</span>
                <span className="text-sm text-muted-foreground">
                  {profileData.role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Status</span>
                <span className="text-sm font-medium text-green-500">
                  Active
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Last Login</span>
                <span className="text-sm text-muted-foreground">
                  Today, 2:45 PM
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h4 className="text-sm font-semibold">Security</h4>
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Enable Two-Factor Auth
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AdminProfilePage;
