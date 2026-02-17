import React, { createContext, useContext, useState, useEffect } from 'react';

const PricingContext = createContext();

export const usePricing = () => {
  return useContext(PricingContext);
};

export const PricingProvider = ({ children }) => {
  const [pricingData, setPricingData] = useState([]); // Raw data from API
  const [pricingPaginationData, setPricingPaginationData] = useState({
    current_page: 1,
    data: [],
    first_page_url: null,
    from: null,
    last_page: 1,
    last_page_url: null,
    links: [],
    next_page_url: null,
    path: null,
    per_page: 15,
    prev_page_url: null,
    to: null,
    total: 0,
  });
  const [transformedData, setTransformedData] = useState({ pushpull: {}, hoses: {} }); // Transformed for Calculator
  const [pricingConfig, setPricingConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllPricing = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/pricing?per_page=all`);
      if (!response.ok) throw new Error("Failed to fetch all pricing data");
      const data = await response.json();
      setTransformedData(transformData(data));
    } catch (err) {
      console.error("Error fetching all pricing data:", err);
    }
  };

  const fetchPricing = async (params = {}) => {
    setLoading(true);
    try {
      const query = new URLSearchParams(params).toString();
      const pricingUrl = `${process.env.REACT_APP_BASE_URL}/api/pricing${query ? `?${query}` : ''}`;
      
      const [pricingRes, configRes] = await Promise.all([
        fetch(pricingUrl),
        fetch(`${process.env.REACT_APP_BASE_URL}/api/pricing/config`)
      ]);

      if (!pricingRes.ok) throw new Error("Failed to fetch pricing data");
      if (!configRes.ok) throw new Error("Failed to fetch pricing config");

      const paginatedData = await pricingRes.json();
      const config = await configRes.json();

      // Handle paginated response
      if (paginatedData.data) {
        setPricingPaginationData(paginatedData);
        setPricingData(paginatedData.data);
      } else {
        // Fallback for non-paginated response
        setPricingData(paginatedData);
      }
      
      setPricingConfig(config);
      setError(null);
    } catch (err) {
      console.error("Error fetching pricing data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = async (newConfig) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/pricing/config`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newConfig)
        });
        if (!response.ok) throw new Error("Failed to update config");
        const updatedConfig = await response.json();
        setPricingConfig(updatedConfig);
        return updatedConfig;
    } catch (err) {
        throw err;
    }
  };

  // Custom Parts API methods
  const searchCustomParts = async (query) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/pricing/custom-parts/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Failed to search custom parts");
      return await response.json();
    } catch (err) {
      console.error("Error searching custom parts:", err);
      throw err;
    }
  };

  const saveCustomPart = async (configData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/pricing/custom-parts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configData)
      });
      if (!response.ok) throw new Error("Failed to save custom part");
      return await response.json();
    } catch (err) {
      console.error("Error saving custom part:", err);
      throw err;
    }
  };

  const deleteCustomPart = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/pricing/custom-parts/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete custom part");
    } catch (err) {
      console.error("Error deleting custom part:", err);
      throw err;
    }
  };

  // Saved Components API Methods
  const saveComponent = async (componentData) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/pricing/components`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(componentData)
      });
      if (!response.ok) throw new Error("Failed to save component");
      return await response.json();
    } catch (err) {
      console.error("Error saving component:", err);
      throw err;
    }
  };

  const searchComponents = async (query) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/pricing/components/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error("Failed to search components");
      return await response.json();
    } catch (err) {
      console.error("Error searching components:", err);
      throw err;
    }
  };

  // Search parts for new cable types by part number
  const searchPartsByNumber = async (cableType, partNumber) =>{
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/pricing/search-by-part?cable_type=${encodeURIComponent(cableType)}&part_number=${encodeURIComponent(partNumber)}`);
      if (!response.ok) throw new Error("Failed to search parts");
      return await response.json();
    } catch (err) {
      console.error("Error searching parts:", err);
      throw err;
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
    fetchAllPricing();
    fetchPricing();
  }, []);

  return (
    <PricingContext.Provider value={{ 
      pricingData, 
      pricingPaginationData,
      transformedData, 
      pricingConfig, 
      loading, 
      error, 
      fetchPricing, 
      fetchAllPricing,
      updateConfig,
      searchCustomParts,
      saveCustomPart,
      deleteCustomPart,
      saveComponent,
      searchComponents,
      searchPartsByNumber
    }}>
      {children}
    </PricingContext.Provider>
  );
};
