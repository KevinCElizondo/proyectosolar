
import { motion } from "framer-motion";
import { BoxesIcon, FileText, DollarSign, Headset } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <BoxesIcon className="w-8 h-8" />,
      title: "Gestión de Inventario",
      description: "Mantén un control total y en tiempo real de tus paneles y equipos solares. Automatiza el seguimiento de existencias y organiza tus productos de forma inteligente para evitar faltantes o excesos.",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Cotizaciones Profesionales",
      description: "Elabora propuestas personalizadas y atractivas en minutos. Integra cálculos de costos y descuentos para generar cotizaciones precisas y seguir cada etapa de tus proyectos.",
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Gestión Financiera",
      description: "Controla todas tus transacciones y pagos desde un solo lugar. Integrado con pasarelas de pago y sistemas de facturación para mantener tus finanzas en orden.",
    },
    {
      icon: <Headset className="w-8 h-8" />,
      title: "Soporte Premium",
      description: "Obtén asistencia especializada y dedicada. Nuestro equipo te acompaña en cada paso, asegurando que tu negocio opere sin contratiempos.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-[#1A1A1A]">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white font-rajdhani mb-6">
            Características Principales de SolarFluidity
          </h2>
        </motion.div>

        <div className="space-y-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="glass p-6 rounded-xl hover:shadow-lg hover:shadow-[#6F3AF2]/20 transition-all border border-white/10"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-shrink-0 text-[#6F3AF2] p-4 bg-[#6F3AF2]/10 rounded-lg">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-white mb-2 font-rajdhani">
                    {feature.title}
                  </h3>
                  <p className="text-[#D3D3D3] font-inter leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
