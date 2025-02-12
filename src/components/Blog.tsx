
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Blog = () => {
  return (
    <section className="py-20 px-4 bg-dark-lighter">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white font-rajdhani mb-4">
            Recursos y Artículos
          </h2>
          <p className="text-xl text-gray-300 font-inter">
            Mantente al día con las últimas tendencias en energía solar
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Energía Solar en Costa Rica",
              description: "Descubre las oportunidades del mercado solar en 2024.",
            },
            {
              title: "Optimiza tu Negocio Solar",
              description: "Estrategias para mejorar la eficiencia operativa.",
            },
            {
              title: "Guía de Instalación Solar",
              description: "Mejores prácticas para instalaciones solares.",
            },
          ].map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass p-6 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all group"
            >
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white font-rajdhani">
                  {article.title}
                </h3>
                <p className="text-gray-300 font-inter">{article.description}</p>
                <button className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors font-inter">
                  Leer más
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
