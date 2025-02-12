
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <section className="py-20 px-4 bg-dark">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white font-rajdhani mb-4">
            Contáctanos
          </h2>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass p-8 rounded-lg space-y-6"
        >
          <div>
            <label htmlFor="name" className="block text-white mb-2 font-inter">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 bg-dark-lighter border border-white/20 rounded-lg text-white focus:border-primary outline-none transition-colors font-inter"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-white mb-2 font-inter">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-dark-lighter border border-white/20 rounded-lg text-white focus:border-primary outline-none transition-colors font-inter"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-white mb-2 font-inter">
              Mensaje
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-4 py-2 bg-dark-lighter border border-white/20 rounded-lg text-white focus:border-primary outline-none transition-colors font-inter"
              placeholder="Tu mensaje"
            ></textarea>
          </div>
          <button className="w-full px-6 py-3 bg-primary hover:bg-primary-hover text-dark font-semibold rounded-lg transition-colors font-inter">
            Enviar Mensaje
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8 text-gray-400 font-inter"
        >
          © 2025 SolarFluidity. Todos los derechos reservados.
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
