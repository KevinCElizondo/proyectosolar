
import { motion } from "framer-motion";
import { BoxesIcon, FileText, DollarSign, Headset } from "lucide-react";
import { useTranslation } from "react-i18next";

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <BoxesIcon className="w-8 h-8" />,
      title: t("features.inventory.title"),
      description: t("features.inventory.description"),
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: t("features.quotes.title"),
      description: t("features.quotes.description"),
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: t("features.financial.title"),
      description: t("features.financial.description"),
    },
    {
      icon: <Headset className="w-8 h-8" />,
      title: t("features.support.title"),
      description: t("features.support.description"),
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
            {t("features.title")}
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
