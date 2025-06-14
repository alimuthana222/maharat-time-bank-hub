import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, MapPin, Star, Clock, Phone, Mail, User, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: string;
  username: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
  university?: string;
  location?: string;
  phone?: string;
  skills?: string[];
  experience_years?: number;
  hourly_rate?: number;
  status: string;
}

interface Review {
  id: string;
  rating: number;
  comment?: string;
  created_at: string;
  reviewer: {
    username: string;
    full_name?: string;
  };
}

export function RealProfileComponent() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Profile>>({});
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchReviews();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setEditForm(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("خطأ في جلب الملف الشخصي");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    if (!user) return;

    try {
      // First, fetch reviews for this user
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select("id, rating, comment, created_at, reviewer_id")
        .eq("reviewed_user_id", user.id)
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;

      if (!reviewsData || reviewsData.length === 0) {
        setReviews([]);
        return;
      }

      // Get unique reviewer IDs
      const reviewerIds = [...new Set(reviewsData.map(review => review.reviewer_id))];

      // Fetch reviewer profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, full_name")
        .in("id", reviewerIds);

      if (profilesError) throw profilesError;

      // Combine reviews with reviewer data
      const reviewsWithReviewers = reviewsData.map(review => {
        const reviewer = profilesData?.find(profile => profile.id === review.reviewer_id);
        return {
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          created_at: review.created_at,
          reviewer: reviewer || { username: "مستخدم محذوف", full_name: null }
        };
      });

      setReviews(reviewsWithReviewers);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: editForm.full_name,
          bio: editForm.bio,
          university: editForm.university,
          location: editForm.location,
          phone: editForm.phone,
          skills: editForm.skills,
          experience_years: editForm.experience_years,
          hourly_rate: editForm.hourly_rate
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("تم تحديث الملف الشخصي بنجاح");
      setEditing(false);
      await fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("خطأ في تحديث الملف الشخصي");
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    const currentSkills = editForm.skills || [];
    setEditForm({
      ...editForm,
      skills: [...currentSkills, newSkill.trim()]
    });
    setNewSkill("");
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = editForm.skills || [];
    setEditForm({
      ...editForm,
      skills: currentSkills.filter(skill => skill !== skillToRemove)
    });
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">جاري التحميل...</div>;
  }

  if (!profile) {
    return <div className="text-center py-12 text-red-500">خطأ في تحميل الملف الشخصي</div>;
  }

  return (
    <div className="space-y-6">
      {/* بطاقة الملف الشخصي الرئيسية */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-2xl">
                  <User className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{profile.full_name || profile.username}</h1>
                <p className="text-gray-600">@{profile.username}</p>
                {profile.university && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                    <MapPin className="h-4 w-4" />
                    {profile.university}
                  </div>
                )}
                {reviews.length > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm">{calculateAverageRating()} ({reviews.length} تقييم)</span>
                  </div>
                )}
              </div>
            </div>
            
            <Dialog open={editing} onOpenChange={setEditing}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="ml-2 h-4 w-4" />
                  تحرير الملف الشخصي
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>تحرير الملف الشخصي</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={updateProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
                      <Input
                        value={editForm.full_name || ""}
                        onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">الجامعة</label>
                      <Input
                        value={editForm.university || ""}
                        onChange={(e) => setEditForm({...editForm, university: e.target.value})}
                        placeholder="أدخل اسم جامعتك"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">نبذة شخصية</label>
                    <Textarea
                      value={editForm.bio || ""}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      placeholder="اكتب نبذة عن نفسك..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">الموقع</label>
                      <Input
                        value={editForm.location || ""}
                        onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                        placeholder="المدينة، البلد"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
                      <Input
                        value={editForm.phone || ""}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        placeholder="07xxxxxxxxx"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">سنوات الخبرة</label>
                      <Input
                        type="number"
                        min="0"
                        value={editForm.experience_years || ""}
                        onChange={(e) => setEditForm({...editForm, experience_years: parseInt(e.target.value) || 0})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">السعر بالساعة (ألف دينار)</label>
                      <Input
                        type="number"
                        min="0"
                        value={editForm.hourly_rate || ""}
                        onChange={(e) => setEditForm({...editForm, hourly_rate: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">المهارات</label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="أضف مهارة جديدة"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      />
                      <Button type="button" onClick={addSkill}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(editForm.skills || []).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit">حفظ التغييرات</Button>
                    <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                      إلغاء
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {profile.bio && (
            <p className="text-gray-700">{profile.bio}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {profile.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{profile.location}</span>
              </div>
            )}
            
            {profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{profile.phone}</span>
              </div>
            )}
            
            {profile.experience_years !== undefined && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{profile.experience_years} سنوات خبرة</span>
              </div>
            )}
          </div>

          {profile.skills && profile.skills.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">المهارات</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* التقييمات */}
      <Card>
        <CardHeader>
          <CardTitle>التقييمات ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد تقييمات بعد</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {review.reviewer.full_name || review.reviewer.username}
                        </span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-gray-700">{review.comment}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(review.created_at).toLocaleDateString("ar")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
