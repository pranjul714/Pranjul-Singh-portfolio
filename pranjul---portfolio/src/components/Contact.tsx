import React from "react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Send, AlertCircle } from "lucide-react";
import images from "../assets/img";
import ParticleBackground from "./ParticleBackground";

export default function Contact() {
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
      // Simulation of sending message
      setSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert("✅ Simulation: Message sent successfully! (Connect a real API to enable actual delivery)");
      resetForm();
      setSubmitting(false);
    },
  });

  return (
    <section className="relative py-32 px-6 lg:px-24 overflow-hidden min-h-screen flex flex-col items-center justify-center">
       
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] -z-10 animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={{ once: true }}
        className="text-center mb-16 relative z-20"
      >
        <h2 className="text-zinc-500 font-bold tracking-widest uppercase text-sm mb-3">
          Get in Touch
        </h2>
        <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight">
          Let’s build something <span className="text-zinc-400">great</span> together.
        </h1>
      </motion.div>

      <div className="relative w-full max-w-4xl px-4">

        <motion.div
          initial={{ x: 100, opacity: 100 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute hidden lg:block -left-35 top-1/4 -translate-y-1/2 z-20 pointer-events-none"
        >
          <img 
            src={images.wallman} 
            alt="Character" 
            className="h-[280px] lg:h-[420px] w-auto object-contain filter  opacity-100"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10 bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 lg:p-12 rounded-[50px] shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
        >
          <form onSubmit={formik.handleSubmit} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 ml-1">
                  Your Name
                </label>
                <input
                  {...formik.getFieldProps("name")}
                  className="w-full px-6 py-4 rounded-2xl bg-white/[0.05] border border-white/10 text-white focus:border-white focus:ring-4 focus:ring-white/10 outline-none transition-all"
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-red-400 text-xs ml-2 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {formik.errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-zinc-400 ml-1">
                  Email Address
                </label>
                <input
                  {...formik.getFieldProps("email")}
                  className="w-full px-6 py-4 rounded-2xl bg-white/[0.05] border border-white/10 text-white focus:border-white focus:ring-4 focus:ring-white/10 outline-none transition-all"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-400 text-xs ml-2 flex items-center gap-1">
                    <AlertCircle size={12} />
                    {formik.errors.email}
                  </p>
                )}
              </div>

            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 ml-1">
                Subject
              </label>
              <input
                {...formik.getFieldProps("subject")}
                className="w-full px-6 py-4 rounded-2xl bg-white/[0.05] border border-white/10 text-white focus:border-white focus:ring-4 focus:ring-white/10 outline-none transition-all"
              />
              {formik.touched.subject && formik.errors.subject && (
                <p className="text-red-400 text-xs ml-2 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {formik.errors.subject}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-zinc-400 ml-1">
                Message
              </label>
              <textarea
                rows={4}
                {...formik.getFieldProps("message")}
                className="w-full px-6 py-4 rounded-2xl bg-white/[0.05] border border-white/10 text-white focus:border-white focus:ring-4 focus:ring-white/10 outline-none resize-none transition-all"
              />
              {formik.touched.message && formik.errors.message && (
                <p className="text-red-400 text-xs ml-2 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {formik.errors.message}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={formik.isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full font-bold py-5 rounded-2xl flex items-center justify-center gap-3 bg-white hover:bg-zinc-200 text-black shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? "Sending..." : "Send Message"}
              {!formik.isSubmitting && <Send size={20} />}
            </motion.button>

          </form>
        </motion.div>
      </div>
    </section>
  );
}
