
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const Pricing = () => {
  return (
    <section className="py-20 px-4 bg-dark">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white font-rajdhani mb-6">
            Planes y Precios
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Básico",
              price: "99",
              features: [
                "Gestión de inventario básico",
                "Cotizaciones ilimitadas",
                "Soporte por email",
                "1 usuario",
              ],
            },
            {
              name: "Profesional",
              price: "199",
              features: [
                "Inventario avanzado",
                "Cotizaciones personalizadas",
                "Soporte prioritario",
                "5 usuarios",
              ],
              highlighted: true,
            },
            {
              name: "Empresarial",
              price: "Personalizado",
              features: [
                "Características personalizadas",
                "Integración con su ERP",
                "Soporte 24/7",
                "Usuarios ilimitados",
              ],
            },
          ].map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`glass p-8 rounded-lg hover:shadow-lg transition-all ${
                plan.highlighted
                  ? "border-primary shadow-primary/20"
                  : "border-white/20"
              }`}
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4 font-rajdhani">
                  {plan.name}
                </h3>
                <div className="text-4xl font-bold text-primary mb-6 font-rajdhani">
                  {typeof plan.price === "number" ? `$${plan.price}` : plan.price}
                  {typeof plan.price === "number" && (
                    <span className="text-lg text-gray-400">/mes</span>
                  )}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-gray-300 font-inter">
                      <Check className="text-primary w-5 h-5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full px-6 py-3 bg-primary hover:bg-primary-hover text-dark font-semibold rounded-lg transition-colors font-inter">
                  Seleccionar Plan
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
