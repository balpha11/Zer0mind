import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, User, MessageSquare } from 'lucide-react';
import React, { useState } from 'react';
import withPageLoader from '@/components/hoc/withPageLoader';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen py-16 md:py-24 bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-block p-2 px-4 rounded-full bg-primary/10 text-primary mb-4 text-sm font-medium">
            Let's Connect
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
            Get in <span className="text-gradient-purple-blue">Touch</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have questions about our services? We're here to help you take your startup to the next level.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-lg"
          >
            <motion.div variants={itemVariants} className="flex items-start space-x-4 group">
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Email Us</h3>
                <p className="text-muted-foreground">support@zer0mind.com</p>
                <p className="text-sm text-muted-foreground mt-1">We'll respond within 24 hours</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start space-x-4 group">
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Call Us</h3>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
                <p className="text-sm text-muted-foreground mt-1">Mon-Fri from 9am to 6pm PST</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start space-x-4 group">
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Visit Us</h3>
                <p className="text-muted-foreground">123 Innovation Street<br />Tech Valley, CA 94025</p>
                <p className="text-sm text-muted-foreground mt-1">Book an appointment</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" /> Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  required
                  placeholder="John Doe"
                />
              </div>

              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className="relative">
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  required
                  placeholder="How can we help you?"
                />
              </div>

              <Button type="submit" className="w-full h-12 text-base rounded-xl bg-primary hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center justify-center">
            <span className="text-sm text-muted-foreground">Developed with ❤️ by</span>
            <span className="ml-2 text-sm font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Betteronics
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default withPageLoader(ContactPage); 