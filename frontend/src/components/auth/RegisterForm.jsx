import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const update = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value
    }));
    setErrors(prev => ({
      ...prev,
      [key]: ""
    }));
  };
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email format";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account Created",
        description: "Registration successful!"
      });
      navigate("/dashboard");
    }, 1500);
  };
  const fieldClass = key => `rounded-lg ${errors[key] ? "border-destructive focus-visible:ring-destructive" : ""}`;
  return <Card className="w-full max-w-md shadow-[var(--shadow-monolith)] border-border/60 rounded-xl">
      <CardHeader className="text-center space-y-1 pb-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-bold text-foreground tracking-tight">
            AI Grievance Portal
          </span>
        </div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Create New Account</h1>
        <p className="text-sm text-muted-foreground">Fill in the details to get started</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[{
          key: "name",
          label: "Full Name",
          type: "text",
          placeholder: "John Doe"
        }, {
          key: "email",
          label: "Email",
          type: "email",
          placeholder: "you@example.com"
        }, {
          key: "phone",
          label: "Phone Number",
          type: "tel",
          placeholder: "+91 9876543210"
        }].map(({
          key,
          label,
          type,
          placeholder
        }) => <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Input id={key} type={type} placeholder={placeholder} value={form[key]} onChange={e => update(key, e.target.value)} className={fieldClass(key)} />
              {errors[key] && <p className="text-xs text-destructive">{errors[key]}</p>}
            </div>)}

          {[{
          key: "password",
          label: "Password",
          show: showPassword,
          toggle: () => setShowPassword(!showPassword)
        }, {
          key: "confirmPassword",
          label: "Confirm Password",
          show: showConfirm,
          toggle: () => setShowConfirm(!showConfirm)
        }].map(({
          key,
          label,
          show,
          toggle
        }) => <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <div className="relative">
                <Input id={key} type={show ? "text" : "password"} placeholder="••••••••" value={form[key]} onChange={e => update(key, e.target.value)} className={`${fieldClass(key)} pr-10`} />
                <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors[key] && <p className="text-xs text-destructive">{errors[key]}</p>}
            </div>)}

          <Button type="submit" className="w-full rounded-lg" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Register"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </CardContent>
    </Card>;
};
export default RegisterForm;