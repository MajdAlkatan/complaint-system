import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoaderIcon } from "react-hot-toast";
import * as z from "zod";
import { useAuthAdminStore } from "../../app/store/adminAuth.store";
import Footer from "../../components/Footer";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import LogoCircle from "/assets/logosyr3@3x 1.svg";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function AdminLoginPage() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const { signIn, isSigningIn, authAdmin } = useAuthAdminStore();

  console.log(authAdmin);

  function onSubmit(values: { email: string; password: string }) {
    signIn(values);
  }

  return (
    <>
      <div className="flex items-center justify-center pb-8 bg-green-50">
        <div className="w-full max-w-[450px]">
          <div className="text-center mb-6">
            <div className="flex justify-center">
              <img src={LogoCircle} className="w-24 h-24" />
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold mb-2 tracking-wide">
              Admin Portal
            </h1>
            <p className="text-gray-700 text-base">بوابة المشرف العام</p>
            <div className="w-14 h-1 bg-primary mx-auto mt-3"></div>
          </div>

          <Card className="bg-white shadow-lg border-none mx-2 ">
            <CardContent className="py-4 md:py-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left block text-gray-700 font-medium text-sm">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="admin@system.gov.sy"
                            className="text-left border bg-gray-50 border-gray-300 text-sm py-3 hover:border-gray-500 focus:ring-1! focus:ring-gray-500!"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left block text-gray-700 font-medium text-sm">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="text-left border bg-gray-50 border-gray-300 text-sm py-3 hover:border-gray-500 focus:ring-1! focus:ring-gray-500!"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-500" />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={isSigningIn}
                    className="w-full bg-primary hover:bg-hover text-white font-medium py-5 text-base"
                  >
                    {isSigningIn ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <p className="text-center text-gray-400 mt-4 text-xs">
            Syrian Arab Republic • Government Complaint System
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
