import React, { createContext, useContext, useState, useEffect } from 'react';

const PricingContext = createContext();

export const usePricing = () => {
  return useContext(PricingContext);
};

export const PricingProvider = ({ children }) => {
  const [pricingData, setPricingData] = useState([]); // Raw data from API
  const [transformedData, setTransformedData] = useState({ pushpull: {}, hoses: {} }); // Transformed for Calculator
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPricing = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/pricing");
      if (!response.ok) throw new Error("Failed to fetch pricing data");
      const data = await response.json();
      setPricingData(data);
      setTransformedData(transformData(data));
      setError(null);
    } catch (err) {
      console.error("Error fetching pricing data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const transformData = (data) => {
    const result = {
        pushpull: {},
        hoses: { standard: [], highPressure: [] }
    };

    data.forEach(item => {
        if (item.category === 'hoses') {
            if (result.hoses[item.sub_category]) {
                result.hoses[item.sub_category].push({
                    id: item.id,
                    partNumber: item.part_number,
                    description: item.description,
                    unitPrice: parseFloat(item.unit_price)
                });
            }
        } else if (item.category === 'pushpull') {
            const series = item.sub_category;
            if (!result.pushpull[series]) {
                result.pushpull[series] = {
                    conduit: [],
                    core: [],
                    hubs: {},
                    sleeves: [],
                    rods: [],
                    hardware: []
                };
            }
            
            const seriesData = result.pushpull[series];
            const componentType = item.component_type;

            if (componentType === 'hubs') {
                const specificType = item.specific_type;
               if(specificType) {
                    seriesData.hubs[specificType] = {
                        id: item.id,
                        partNumber: item.part_number,
                        unitPrice: parseFloat(item.unit_price),
                        description: item.description
                    };
               }
            } else if (['conduit', 'core', 'hardware'].includes(componentType)) {
                seriesData[componentType].push({
                    id: item.id,
                    partNumber: item.part_number,
                    unitPrice: parseFloat(item.unit_price),
                    description: item.description
                });
            } else if (['sleeves', 'rods'].includes(componentType)) {
                seriesData[componentType].push({
                    id: item.id,
                    travel: item.travel,
                    partNumber: item.part_number,
                    unitPrice: parseFloat(item.unit_price),
                    description: item.description
                });
            }
        }
    });
    return result;
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  return (
    <PricingContext.Provider value={{ pricingData, transformedData, loading, error, fetchPricing }}>
      {children}
    </PricingContext.Provider>
  );
};
