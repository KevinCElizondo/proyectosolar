
import { motion } from "framer-motion";
import { Database, BarChart3, AlertCircle } from "lucide-react";

const Features = () => {
  return (
    <section className="py-20 px-4 bg-dark-lighter">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white font-rajdhani mb-6">
            Gestión de Inventario
          </h2>
          <p className="text-xl text-gray-300 font-inter">
            Control total de su inventario de paneles y equipos solares
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Database className="w-8 h-8" />,
              title: "Monitoreo en Tiempo Real",
              description: "Monitorear existencias de manera clara y en tiempo real",
            },
            {
              icon: <BarChart3 className="w-8 h-8" />,
              title: "Registro de Movimientos",
              description: "Registrar ingresos y salidas de mercancía",
            },
            {
              icon: <AlertCircle className="w-8 h-8" />,
              title: "Alertas Automáticas",
              description: "Generar alertas de nivel mínimo de inventario",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass p-6 rounded-lg hover:shadow-lg hover:shadow-primary/20 transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-primary mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2 font-rajdhani">
                  {feature.title}
                </h3>
                <p className="text-gray-300 font-inter">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
