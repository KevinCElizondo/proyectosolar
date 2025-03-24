
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const Pricing = () => {
  const { t } = useTranslation();

  const plans = [
    {
      name: "Plan Freemium",
      description: "Para emprendedores o técnicos independientes",
      price: "0",
      features: [
        "15 facturas electrónicas/mes (XML/PDF)",
        "3 proyectos activos",
        "1 usuario + soporte por correo (48h)",
        "Reportes básicos (solo PDF)"
      ],
      negativeFeatures: [
        "API para integraciones",
        "Automatizaciones"
      ],
      tag: "Gratuito",
      color: "green",
      cta: "Comenzar Gratis"
    },
    {
      name: "Plan Básico",
      description: "Para PYMES con proyectos comerciales",
      price: "39",
      features: [
        "50 facturas/mes (+$0.30 por adicional)",
        "10 proyectos activos",
        "3 usuarios + roles básicos",
        "API básica (integración con software local)",
        "Automatizaciones internas"
      ],
      tag: "Ahorro",
      color: "orange",
      cta: "Prueba 7 Días Gratis"
    },
    {
      name: "Plan Profesional",
      description: "Para empresas con proyectos industriales o contratos gubernamentales",
      price: "89",
      features: [
        "Facturas y proyectos ilimitados",
        "API premium (20 llamadas/minuto + webhooks)",
        "10 usuarios + permisos jerárquicos",
        "Automatizaciones avanzadas",
        "Soporte 24/7 con técnicos especializados"
      ],
      highlighted: true,
      tag: "Más Popular",
      color: "blue",
      cta: "Agendar Demo + Mes Gratis"
    },
  ];

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
          <p className="text-gray-300 max-w-3xl mx-auto">
            Elegí el plan perfecto para tu negocio. Todos nuestros planes incluyen facturación electrónica offline, gestión de proyectos y acceso a nuestra plataforma especializada.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className={`glass p-8 rounded-lg transition-all ${
                plan.highlighted
                  ? "border-primary shadow-primary/20 transform scale-105 shadow-xl relative"
                  : "border-white/20 hover:translate-y-[-10px]"
              }`}
            >
              {(plan.tag || plan.highlighted) && (
                <div className={`absolute top-0 right-0 ${plan.color ? `bg-${plan.color}-500` : 'bg-primary'} text-dark px-4 py-1 rounded-bl-md font-semibold text-sm`}>
                  {plan.tag || 'Más Popular'}
                </div>
              )}
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-2 font-rajdhani">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4">{plan.description}</p>
                <div className="text-3xl font-bold text-primary mb-6 font-rajdhani">
                  ${plan.price}<span className="text-lg text-gray-400">/mes</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-gray-300 font-inter">
                      <span className="mr-2 text-green-500">✓</span>
                      {feature}
                    </li>
                  ))}
                  {plan.negativeFeatures && plan.negativeFeatures.map((feature, featureIndex) => (
                    <li key={`neg-${featureIndex}`} className="flex items-center gap-2 text-gray-300 font-inter">
                      <span className="mr-2 text-red-500">✗</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full px-6 py-3 ${
                  plan.highlighted 
                    ? 'bg-primary hover:bg-primary/90' 
                    : 'bg-transparent border border-gray-500 hover:bg-gray-800'
                } text-white font-semibold rounded-lg transition-all duration-300 font-inter`}>
                  {plan.cta}
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
