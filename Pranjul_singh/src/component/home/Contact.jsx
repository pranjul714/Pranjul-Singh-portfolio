import React from "react";
import { trackAction } from "../../services/tracking.js";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Send, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import images from "../../assets/img";
import { sendContactMessage } from "../../services/api";
import { useScrollReveal } from "../../hooks/useScrollAnimation";

export default function Contact() {
  const containerRef = useScrollReveal();
  const validationSchema = Yup.object({
    name: Yup.string().min(2, "Name is too short").required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    subject: Yup.string()
      .min(5, "Subject should be more descriptive")
      .required("Subject is required"),
    message: Yup.string()
      .min(20, "Message must be at least 20 characters")
      .required("Message is required"),
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", subject: "", message: "" },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      trackAction('click', 'Submit Contact Form');
      try {
        const { data } = await sendContactMessage(values);
        if (data.success) {
          toast.success("✅ Message sent successfully! I'll get back to you soon.");
          resetForm();
        } else {
          toast.error("Failed to send: " + (data.message || "Please try again."));
        }
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Could not send message. Please email me directly at pranjulsingh38@gmail.com";
        toast.error(`❌ ${errorMsg}`);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <section ref={containerRef} id="contact" className="relative py-20 lg:py-32 px-6 lg:px-24 overflow-hidden min-h-screen flex flex-col items-center justify-center">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />

      <div 
        data-gsap
        className="text-center mb-12 lg:mb-16 relative z-20"
      >
        <h2 className="text-emerald-400 font-bold tracking-widest uppercase text-[10px] lg:text-sm mb-3">
          Get in Touch
        </h2>
        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white leading-tight">
          Let’s build something <span className="text-emerald-400">great</span> together.
        </h1>
      </div>

      <div className="relative w-full max-w-4xl">

        <div
          data-gsap
          className="absolute hidden xl:block -left-35 top-1/4 -translate-y-1/2 z-20 pointer-events-none"
        >
          <img 
            src={images.wallman} 
            alt="Peeking Character" 
            className="h-[280px] lg:h-[420px] w-auto object-contain drop-shadow-[-10px_20px_30px_rgba(0,0,0,0.5)]"
          />
        </div>

        <div
          data-gsap
          className="relative z-10 bg-white/[0.03] backdrop-blur-md border border-white/10 p-6 sm:p-8 lg:p-12 rounded-[30px] lg:rounded-[50px] shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
        >
          <form onSubmit={formik.handleSubmit} className="space-y-5 lg:space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">

              <div className="space-y-2">
                <label className="text-xs lg:text-sm text-emerald-100/70 ml-1">
                  Your Name
                </label>
                <input
                  {...formik.getFieldProps("name")}
                  className="w-full px-5 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl bg-white/[0.05] border border-white/10 text-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 outline-none transition-all"
                  placeholder="John Doe"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-400 text-[10px] lg:text-xs ml-2 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {formik.errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs lg:text-sm text-emerald-100/70 ml-1">
                  Email Address
                </label>
                <input
                  {...formik.getFieldProps("email")}
                  className="w-full px-5 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl bg-white/[0.05] border border-white/10 text-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 outline-none transition-all"
                  placeholder="john@example.com"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-400 text-[10px] lg:text-xs ml-2 flex items-center gap-1">
                    <AlertCircle size={10} />
                    {formik.errors.email}
                  </p>
                )}
              </div>

            </div>

            <div className="space-y-2">
              <label className="text-xs lg:text-sm text-emerald-100/70 ml-1">
                Subject
              </label>
              <input
                {...formik.getFieldProps("subject")}
                className="w-full px-5 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl bg-white/[0.05] border border-white/10 text-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 outline-none transition-all"
                placeholder="Project Inquiry"
              />
              {formik.touched.subject && formik.errors.subject && (
                <p className="text-red-400 text-[10px] lg:text-xs ml-2 flex items-center gap-1">
                  <AlertCircle size={10} />
                  {formik.errors.subject}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs lg:text-sm text-emerald-100/70 ml-1">
                Message
              </label>
              <textarea
                rows="4"
                {...formik.getFieldProps("message")}
                className="w-full px-5 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl bg-white/[0.05] border border-white/10 text-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10 outline-none resize-none transition-all"
                placeholder="Write your message here..."
              />
              {formik.touched.message && formik.errors.message && (
                <p className="text-red-400 text-[10px] lg:text-xs ml-2 flex items-center gap-1">
                  <AlertCircle size={10} />
                  {formik.errors.message}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={formik.isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full font-bold py-4 lg:py-5 rounded-xl lg:rounded-2xl flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Sending..." : "Send Message"}
              {!formik.isSubmitting && <Send size={18} />}
            </motion.button>

          </form>
        </div>
      </div>
    </section>
  );
}
