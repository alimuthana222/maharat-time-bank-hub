
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { ArrowRightLeft, Clock, Loader2 } from 'lucide-react';

interface TimeBankTransactionProps {
  mode: 'earn' | 'spend';
  onComplete?: () => void;
}

interface User {
  id: string;
  name: string;
  avatarFallback: string;
  university: string;
}

export function TimeBankTransaction({ mode, onComplete }: TimeBankTransactionProps) {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [hours, setHours] = useState<number>(1);
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'أحمد محمد', avatarFallback: 'أم', university: 'جامعة الملك سعود' },
    { id: '2', name: 'سارة العتيبي', avatarFallback: 'سع', university: 'جامعة الأميرة نورة' },
    { id: '3', name: 'خالد الزهراني', avatarFallback: 'خز', university: 'جامعة الملك فهد' },
  ]);
  const { user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser || hours <= 0 || !description.trim()) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    if (!user) {
      toast.error('يرجى تسجيل الدخول لإتمام العملية');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Determine provider and recipient based on mode
      const providerId = mode === 'earn' ? selectedUser : user.id;
      const recipientId = mode === 'earn' ? user.id : selectedUser;
      
      // Create transaction in database
      const { error } = await supabase
        .from('time_bank_transactions')
        .insert({
          provider_id: providerId,
          recipient_id: recipientId,
          hours,
          description,
          status: 'pending'
        });
      
      if (error) throw error;
      
      toast.success(`تم إنشاء معاملة ${mode === 'earn' ? 'اكتساب' : 'استخدام'} الساعات بنجاح`);
      
      // Reset form
      setSelectedUser('');
      setHours(1);
      setDescription('');
      
      // Call onComplete callback if provided
      if (onComplete) onComplete();
      
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      toast.error(error.message || 'حدث خطأ أثناء إنشاء المعاملة');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load users from database in a real implementation
  React.useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, username, university')
          .neq('id', user.id);
          
        if (error) throw error;
        
        if (data) {
          const formattedUsers = data.map(u => ({
            id: u.id,
            name: u.full_name || u.username,
            avatarFallback: (u.full_name || u.username || '').substring(0, 2),
            university: u.university || ''
          }));
          
          setUsers(formattedUsers);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
  }, [user]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {mode === 'earn' ? (
            <>
              <Clock className="h-5 w-5 text-green-500" />
              <span>اكتساب ساعات</span>
            </>
          ) : (
            <>
              <ArrowRightLeft className="h-5 w-5 text-blue-500" />
              <span>استخدام ساعات</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">
              {mode === 'earn' ? 'اختر الشخص الذي ستقدم له الخدمة' : 'اختر مقدم الخدمة'}
            </Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="اختر مستخدم" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{user.avatarFallback}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.university}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hours">عدد الساعات</Label>
            <Input 
              id="hours" 
              type="number" 
              min="0.5" 
              step="0.5" 
              value={hours} 
              onChange={(e) => setHours(parseFloat(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">وصف الخدمة</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب وصفاً موجزاً للخدمة المقدمة..."
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled={isLoading} type="submit">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>جاري المعالجة...</span>
              </>
            ) : (
              <span>
                {mode === 'earn' ? 'اكتساب الساعات' : 'استخدام الساعات'}
              </span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
