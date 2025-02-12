
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const Pricing = () => {
  const { t } = useTranslation();

  const plans = [
    {
      name: t("pricing.basic.title"),
      price: "99",
      features: [
        t("pricing.basic.features.1"),
        t("pricing.basic.features.2"),
        t("pricing.basic.features.3"),
        t("pricing.basic.features.4"),
      ],
    },
    {
      name: t("pricing.pro.title"),
      price: "199",
      features: [
        t("pricing.pro.features.1"),
        t("pricing.pro.features.2"),
        t("pricing.pro.features.3"),
        t("pricing.pro.features.4"),
      ],
      highlighted: true,
    },
    {
      name: t("pricing.enterprise.title"),
      price: t("pricing.custom"),
      features: [
        t("pricing.enterprise.features.1"),
        t("pricing.enterprise.features.2"),
        t("pricing.enterprise.features.3"),
        t("pricing.enterprise.features.4"),
      ],
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
            {t("pricing.title")}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
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
                  {plan.price === t("pricing.custom") ? plan.price : `$${plan.price}`}
                  {plan.price !== t("pricing.custom") && (
                    <span className="text-lg text-gray-400">{t("pricing.month")}</span>
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
                  {t("pricing.select")}
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
