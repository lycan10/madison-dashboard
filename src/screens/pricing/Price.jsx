import React, { useState, useEffect, useRef } from "react";

import { usePricing } from "../../context/PricingContext";

const Price = () => {
  const [cableType, setCableType] = useState("Push-pull cable");
  const [partNumberData, setPartNumberData] = useState({
    prefix: "100",
    type: "0",
    series: "",
    travel: "",
    fitting1: "",
    fitting2: "",
    length: "",
  });
  const [parts, setParts] = useState([]);
  const [assemblyTitle, setAssemblyTitle] = useState("");
  
  // Input refs for auto-focus (OTP behavior)
  const typeRef = useRef(null);
  const seriesRef = useRef(null);
  const travelRef = useRef(null);
  const fit1Ref = useRef(null);
  const fit2Ref = useRef(null);
  const lengthRef = useRef(null);

  const inputRefs = {
    type: typeRef,
    series: seriesRef,
    travel: travelRef,
    fitting1: fit1Ref,
    fitting2: fit2Ref,
    length: lengthRef
  };

  const nextField = {
    type: "series",
    series: "travel",
    travel: "fitting1",
    fitting1: "fitting2",
    fitting2: "length"
  };

  const prevField = {
    series: "type",
    travel: "series",
    fitting1: "travel",
    fitting2: "fitting1",
    length: "fitting2"
  };
  
  // Hydraulic Hose state
  // ... (keeping existing rest of the state)
  const [hoseData, setHoseData] = useState({
    hoseType: "",
    partNumber: "",
    length: ""
  });
  
  

  // Manual Part Add State
  const [showAddPartModal, setShowAddPartModal] = useState(false);
  const [newManualPart, setNewManualPart] = useState({
    partName: "",
    quantity: 1,
    unitPrice: 0,
    saveToCatalog: false
  });
  
  // Component Search State
  const [componentSearchQuery, setComponentSearchQuery] = useState("");
  const [componentSearchResults, setComponentSearchResults] = useState([]);
  
  const { transformedData: priceData, pricingConfig, saveComponent, searchComponents, searchPartsByNumber } = usePricing();

  const CostBreakdown = ({ partsTotal, config }) => {
    const cost = parseFloat(partsTotal);
    const tariff = cost * (parseFloat(config.tariff_percent) / 100);
    // Step 1: Cost + Tariff
    const costWithTariff = cost + tariff;
    
    const labor = parseFloat(config.labor_cost);
    // Step 2: (Cost + Tariff) + Labor
    const costWithLabor = costWithTariff + labor;


    // Note: The user prompt image suggests Overhead is calculated on the BASE COST? 
    // "Overhead 20%: 60.66" where previous was 50.55. 
    // 50.55 + (44.95 * 0.20) = 50.55 + 8.99 = 59.54... Not matching 60.66.
    // Let's check 50.55 * 1.20 = 60.66.
    // So Overhead is 20% OF THE RUNNING TOTAL.
    const overheadAmount = costWithLabor * (parseFloat(config.overhead_percent) / 100);
    const costWithOverhead = costWithLabor + overheadAmount;

    const misc = parseFloat(config.misc_cost);
    const trueCost = costWithOverhead + misc;

    // Margin 35%
    // Usually Price = Cost / (1 - Margin%)
    const marginPercent = parseFloat(config.margin_percent) / 100;
    const total = trueCost / (1 - marginPercent);

    return (
        <div style={{ maxWidth: "400px", marginLeft: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                    <tr>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>Cost</td>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}></td>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd", textAlign: "right" }}>{cost.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>Tariff</td>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{config.tariff_percent}%</td>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd", textAlign: "right" }}>{(cost + tariff).toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>Labor</td>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>${config.labor_cost}</td>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd", textAlign: "right" }}>{costWithLabor.toFixed(2)}</td>
                    </tr>
                      <tr>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>Overhead</td>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{config.overhead_percent}%</td>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd", textAlign: "right" }}>{costWithOverhead.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>Misc</td>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>${config.misc_cost}</td>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd", textAlign: "right" }}>{trueCost.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>True cost</td>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}></td>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd", textAlign: "right" }}>{trueCost.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>Margin</td>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{config.margin_percent}%</td>
                        <td style={{ padding: "5px", borderBottom: "1px solid #ddd", textAlign: "right" }}>{total.toFixed(2)}</td>
                    </tr>
                      <tr style={{ fontWeight: "bold", fontSize: "1.2em" }}>
                        <td style={{ padding: "10px 5px" }}>Total</td>
                        <td style={{ padding: "10px 5px" }}></td>
                        <td style={{ padding: "10px 5px", textAlign: "right" }}>{total.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
  };


  useEffect(() => {
    if (cableType !== "Push-pull cable") return;

    const { series, travel, fitting1, fitting2, length } = partNumberData;
    
    if (!series || !travel || !fitting1 || !fitting2 || !length) {
      setParts([]);
      return;
    }

    const seriesData = priceData.pushpull[series];
    if (!seriesData) {
      setParts([]);
      return;
    }

    const calculatedParts = [];
    const lengthInches = parseInt(length) || 0;
    const travelInches = parseInt(travel) || 0;

    if (seriesData.conduit.length > 0) {
      const conduit = seriesData.conduit[0];
      calculatedParts.push({
        partName: "Conduit",
        partNumber: conduit.partNumber,
        quantity: lengthInches,
        unitPrice: conduit.unitPrice.toFixed(2),
        description: conduit.description,
      });
    }

    if (seriesData.core.length > 0) {
      const core = seriesData.core[0];
      calculatedParts.push({
        partName: "Core",
        partNumber: core.partNumber,
        quantity: lengthInches,
        unitPrice: core.unitPrice.toFixed(2),
        description: core.description,
      });
    }

    const addFitting = (fittingCode) => {
      if (fittingCode === "2" && seriesData.hubs.bulkhead) {
        calculatedParts.push({
          partName: "Bulkhead Hub",
          partNumber: seriesData.hubs.bulkhead.partNumber,
          quantity: 1,
          unitPrice: seriesData.hubs.bulkhead.unitPrice.toFixed(2),
          description: seriesData.hubs.bulkhead.description,
        });
        calculatedParts.push({
          partName: "Hub Nut",
          partNumber: seriesData.hardware[0].partNumber,
          quantity: 1,
          unitPrice: seriesData.hardware[0].unitPrice.toFixed(2),
          description: seriesData.hardware[0].description,
        });
        calculatedParts.push({
          partName: "Lock Washer",
          partNumber: seriesData.hardware[0].partNumber,
          quantity: 1,
          unitPrice: seriesData.hardware[0].unitPrice.toFixed(2),
          description: seriesData.hardware[0].description,
        });
      } else if (fittingCode === "3" && seriesData.hubs.clamp) {
        calculatedParts.push({
          partName: "Clamp Hub",
          partNumber: seriesData.hubs.clamp.partNumber,
          quantity: 1,
          unitPrice: seriesData.hubs.clamp.unitPrice.toFixed(2),
          description: seriesData.hubs.clamp.description,
        });
      } else if (fittingCode === "5" && seriesData.hubs.combo) {
        calculatedParts.push({
          partName: "B-C Combo Hub",
          partNumber: seriesData.hubs.combo.partNumber,
          quantity: 1,
          unitPrice: seriesData.hubs.combo.unitPrice.toFixed(2),
          description: seriesData.hubs.combo.description,
        });
      }
    };

    addFitting(fitting1);
    addFitting(fitting2);

    const sleeve = seriesData.sleeves.find((s) => s.travel === travelInches);
    if (sleeve) {
      calculatedParts.push({
        partName: `Sleeve ${travelInches}" Travel`,
        partNumber: sleeve.partNumber,
        quantity: 2,
        unitPrice: sleeve.unitPrice.toFixed(2),
        description: sleeve.description,
      });
    }

    const rod = seriesData.rods.find((r) => r.travel === travelInches);
    if (rod) {
      calculatedParts.push({
        partName: `Rod ${travelInches}" Travel`,
        partNumber: rod.partNumber,
        quantity: 2,
        unitPrice: rod.unitPrice.toFixed(2),
        description: rod.description,
      });
    }

    calculatedParts.push({
      partName: "Rod Nut",
      partNumber: seriesData.hardware[1].partNumber,
      quantity: 2,
      unitPrice: seriesData.hardware[1].unitPrice.toFixed(2),
      description: seriesData.hardware[1].description,
    });

    calculatedParts.push({
      partName: "Rod Seal",
      partNumber: seriesData.hardware[2].partNumber,
      quantity: 2,
      unitPrice: seriesData.hardware[2].unitPrice.toFixed(2),
      description: seriesData.hardware[2].description,
    });

    calculatedParts.push({
      partName: "Sleeve Seal",
      partNumber: seriesData.hardware[3].partNumber,
      quantity: 2,
      unitPrice: seriesData.hardware[3].unitPrice.toFixed(2),
      description: seriesData.hardware[3].description,
    });

    setParts(calculatedParts);
  }, [partNumberData, priceData, cableType]);

  // Calculate hydraulic hose parts
  useEffect(() => {
    if (cableType !== "Hydraulic Hose" || !hoseData.hoseType || !hoseData.partNumber || !hoseData.length) {
      if (cableType === "Hydraulic Hose") {
        setParts([]);
      }
      return;
    }

    const selectedHose = priceData.hoses?.[hoseData.hoseType]?.find(
      (hose) => hose.partNumber === hoseData.partNumber
    );

    if (!selectedHose) return;

    const length = parseInt(hoseData.length) || 0;
    
    const calculatedParts = [{
      partName: `${selectedHose.description} (${hoseData.partNumber})`,
      partNumber: selectedHose.partNumber,
      quantity: length,
      unitPrice: selectedHose.unitPrice,
      description: selectedHose.description,
    }];

    setParts(calculatedParts);
  }, [cableType, hoseData, priceData]);

  // useEffect for new cable types - fetch from database based on part number
  useEffect(() => {
    // Only run for new cable types (not Push-pull or Hydraulic Hose)
    if (cableType === "Push-pull cable" || cableType === "Hydraulic Hose" || !cableType) {
      return;
    }

    // Construct part number from Series, Travel, Fitting fields (excluding Type)
    const partNumber = [
      partNumberData.series,
      partNumberData.travel,
      partNumberData.fitting1,
      partNumberData.fitting2
    ].filter(Boolean).join('');

    // Only fetch if we have at least some part number data
    if (!partNumber || partNumber.trim() === "") {
      setParts([]);
      setAssemblyTitle("");
      return;
    }

    const fetchParts = async () => {
      try {
        console.log('Fetching parts for:', { cableType, partNumber });
        const results = await searchPartsByNumber(cableType, partNumber);
        console.log('Results received:', results);
        
        // Transform results to match the parts format
        const lengthInches = parseInt(partNumberData.length) || 0;
        
        // Extract assembly title if available
        if (results.length > 0 && results[0].is_assembly_item) {
          setAssemblyTitle(results[0].assembly_title);
        } else {
          setAssemblyTitle("");
        }

        const transformedParts = results.map(item => {
          let quantity = 1;
          
          if (item.is_assembly_item) {
            // New logic based on BOM 'reqd' field
            if (item.quantity_required === "A/R") {
              quantity = lengthInches;
            } else {
              // Extract numeric value from quantity_required (e.g. "2" or 2)
              quantity = parseFloat(item.quantity_required) || 1;
            }
          } else {
            // Fallback for non-assembly items (if any)
            const lowerName = (item.component_type || item.description || "").toLowerCase();
            if (lowerName.includes("conduit") || lowerName.includes("core")) {
              quantity = lengthInches;
            }
          }
          
          return {
            partName: item.part_name || item.component_type || "Component",
            partNumber: item.part_number,
            quantity: quantity,
            unitPrice: parseFloat(item.unit_price).toFixed(2),
            description: item.description || ""
          };
        });

        setParts(transformedParts);
      } catch (error) {
        console.error("Error fetching parts:", error);
        setParts([]);
        setAssemblyTitle("");
      }
    };

    fetchParts();
  }, [cableType, partNumberData.type, partNumberData.series, partNumberData.travel, partNumberData.fitting1, partNumberData.fitting2, partNumberData.length, searchPartsByNumber]);

  const handlePartNumberChange = (field, value) => {
    setPartNumberData((prev) => ({ ...prev, [field]: value }));
    
    // Auto-focus logic
    if (value.length >= 1 && nextField[field]) {
      const nextFieldName = nextField[field];
      if (inputRefs[nextFieldName] && inputRefs[nextFieldName].current) {
        inputRefs[nextFieldName].current.focus();
      }
    }
  };

  const handleKeyDown = (field, e) => {
    // Backspace logic: if field is empty and we press backspace, go to previous field
    if (e.key === 'Backspace' && !partNumberData[field] && prevField[field]) {
      const prevFieldName = prevField[field];
      if (inputRefs[prevFieldName] && inputRefs[prevFieldName].current) {
        inputRefs[prevFieldName].current.focus();
      }
    }
  };

  const handleQuantityChange = (index, newQuantity) => {
    setParts((prevParts) => {
      const updatedParts = [...prevParts];
      updatedParts[index] = { ...updatedParts[index], quantity: newQuantity };
      return updatedParts;
    });
  };

  const calculateTotal = () => {
    return parts.reduce((sum, part) => sum + parseFloat(part.unitPrice) * part.quantity, 0).toFixed(2);
  };

  const fullPartNumber = `${partNumberData.prefix}-${partNumberData.type}${partNumberData.series}${partNumberData.travel}${partNumberData.fitting1}${partNumberData.fitting2}-${partNumberData.length.padStart(4, "0")}`;

  /* REMOVED CONFIG PERSISTENCE HANDLERS */

  const handleComponentSearch = async (query) => {
    setComponentSearchQuery(query);
    if (query.length < 2) {
      setComponentSearchResults([]);
      return;
    }
    try {
      const results = await searchComponents(query);
      setComponentSearchResults(results);
    } catch (err) {
      console.error("Component search failed", err);
    }
  };

  const selectSavedComponent = (component) => {
    setNewManualPart({
      ...newManualPart,
      partName: component.name,
      unitPrice: component.unit_price,
      saveToCatalog: false // Don't save it again if we just loaded it
    });
    setComponentSearchQuery("");
    setComponentSearchResults([]);
  };

  const handleAddManualPart = async () => {
    if (!newManualPart.partName) return;
    
    // Auto-save to catalog if checked
    if (newManualPart.saveToCatalog) {
        try {
            await saveComponent({
                name: newManualPart.partName,
                unit_price: parseFloat(newManualPart.unitPrice)
            });
        } catch (err) {
            console.error("Failed to save component to catalog", err);
            // Continue adding to parts list even if save fails
        }
    }
    
    setParts(prevParts => [...prevParts, {
      ...newManualPart,
      partName: newManualPart.partName, // Ensure consistent naming
      partNumber: "MANUAL",
      description: "Manual Part Entry",
      unitPrice: parseFloat(newManualPart.unitPrice)
    }]);
    
    setNewManualPart({ partName: "", quantity: 1, unitPrice: 0, saveToCatalog: false });
    setShowAddPartModal(false);
    setComponentSearchQuery("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ background: "#f8f9fa", padding: "15px", marginBottom: "20px", borderRadius: "8px" }}>
        <h2 style={{ margin: "0 0 10px 0" }}>Madison Generator - Pricing</h2>
      </div>

      <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
       {/*} <h3>Price Calculator</h3>
        <hr />*/}





        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Type of Cable</label>
          <select
            value={cableType}
            onChange={(e) => {
              setCableType(e.target.value);
              setParts([]); // Clear parts when switching
              if (e.target.value === "Hydraulic Hose") {
                setHoseData({ hoseType: "", partNumber: "", length: "" });
              } else {
                // All other types (Push-pull and new types) use the same input structure
                setPartNumberData({ prefix: "", type: "", series: "", travel: "", fitting1: "", fitting2: "", length: "" });
              }
            }}
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            <option>Push-pull cable</option>
            <option>Hydraulic Hose</option>
            <option>T handle</option>
            <option>Positive Lock</option>
            <option>Quick Disconnect</option>
            <option>Quick Connect</option>
            <option>PTO Cable</option>
            <option>Shift Cable</option>
            <option>RVC</option>
          </select>
        </div>

        {/* Push-pull cable AND new cable types use the same interface */}
        {cableType !== "Hydraulic Hose" && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Part Number</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                {/* Prefix field - only for Push-pull cable */}
                {cableType === "Push-pull cable" && (
                  <>
                    <input
                      type="text"
                      placeholder="Prefix"
                      value={partNumberData.prefix}
                      onChange={(e) => handlePartNumberChange("prefix", e.target.value)}
                      maxLength="3"
                      readOnly
                      style={{ 
                        width: "60px", 
                        padding: "8px", 
                        border: "1px solid #ccc", 
                        borderRadius: "4px",
                        backgroundColor: "#f5f5f5"
                      }}
                    />
                    <span>-</span>
                  </>
                )}
                {cableType === "Push-pull cable" ? (
                  <>
                  <input
                  type="text"
                  placeholder="Type"
                  ref={typeRef}
                  readOnly
                  value={partNumberData.type}
                  onChange={(e) => handlePartNumberChange("type", e.target.value)}
                  onKeyDown={(e) => handleKeyDown("type", e)}
                  maxLength="1"
                  style={{ width: "40px", padding: "8px", border: "1px solid #ccc", backgroundColor: "#f5f5f5", borderRadius: "4px" }}
                />
                  </>
                ) : (
                  <input
                  type="text"
                  placeholder="Type"
                  ref={typeRef}
                  value={partNumberData.type}
                  onChange={(e) => handlePartNumberChange("type", e.target.value)}
                  onKeyDown={(e) => handleKeyDown("type", e)}
                  maxLength="1"
                  style={{ width: "40px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
                )}
              
                <input
                  type="text"
                  placeholder="Series (3,4,6)"
                  ref={seriesRef}
                  value={partNumberData.series}
                  onChange={(e) => handlePartNumberChange("series", e.target.value)}
                  onKeyDown={(e) => handleKeyDown("series", e)}
                  maxLength="1"
                  style={{ width: "80px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
                <input
                  type="text"
                  placeholder="Travel (1-7)"
                  ref={travelRef}
                  value={partNumberData.travel}
                  onChange={(e) => handlePartNumberChange("travel", e.target.value)}
                  onKeyDown={(e) => handleKeyDown("travel", e)}
                  maxLength="1"
                  style={{ width: "80px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
                <input
                  type="text"
                  placeholder="Fit1 (2,3,5)"
                  ref={fit1Ref}
                  value={partNumberData.fitting1}
                  onChange={(e) => handlePartNumberChange("fitting1", e.target.value)}
                  onKeyDown={(e) => handleKeyDown("fitting1", e)}
                  maxLength="1"
                  style={{ width: "80px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
                <input
                  type="text"
                  placeholder="Fit2 (2,3,5)"
                  ref={fit2Ref}
                  value={partNumberData.fitting2}
                  onChange={(e) => handlePartNumberChange("fitting2", e.target.value)}
                  onKeyDown={(e) => handleKeyDown("fitting2", e)}
                  maxLength="1"
                  style={{ width: "80px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
                <span>-</span>
                <input
                  type="text"
                  placeholder="Length (inches)"
                  ref={lengthRef}
                  value={partNumberData.length}
                  onChange={(e) => handlePartNumberChange("length", e.target.value)}
                  onKeyDown={(e) => handleKeyDown("length", e)}
                  maxLength="4"
                  style={{ width: "100px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
              </div>
              <div style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
                <strong>Part Number:</strong> {fullPartNumber}
              </div>
              <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
                {cableType === "Push-pull cable" ? (
                  "Series: 3,4,6 | Travel: 1-7 inches | Fitting: 2=Bulkhead, 3=Clamp, 5=Combo"
                ) : (
                  "Enter part number starting from Type field (e.g., 30018 across Type/Series/Travel/Fitting fields)"
                )}
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "8px" }}>
                <label style={{ margin: 0, fontWeight: "600" }}>Parts Breakdown</label>
                {assemblyTitle && (
                  <span style={{ fontSize: "14px", fontWeight: "bold", color: "#007bff", fontStyle: "italic" }}>
                    {assemblyTitle}
                  </span>
                )}
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #d0d0d0" }}>
                <thead>
                  <tr style={{ background: "#f3f3f3" }}>
                    <th style={{ padding: "10px", border: "1px solid #d0d0d0", textAlign: "left" }}>Part Name</th>
                    <th style={{ padding: "10px", border: "1px solid #d0d0d0", textAlign: "left" }}>Part Number</th>
                    <th style={{ padding: "10px", border: "1px solid #d0d0d0", textAlign: "left" }}>Quantity</th>
                    <th style={{ padding: "10px", border: "1px solid #d0d0d0", textAlign: "right" }}>Unit Price</th>
                    <th style={{ padding: "10px", border: "1px solid #d0d0d0", textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.length > 0 ? (
                    parts.map((part, index) => (
                      <tr key={index}>
                        <td style={{ padding: "8px", border: "1px solid #d0d0d0" }}>{part.partName}</td>
                        <td style={{ padding: "8px", border: "1px solid #d0d0d0" }}>{part.partNumber}</td>
                        <td style={{ padding: "8px", border: "1px solid #d0d0d0" }}>
                          <input
                            type="number"
                            min="1"
                            value={part.quantity}
                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                            style={{ width: "60px", padding: "4px", border: "1px solid #ccc", borderRadius: "4px" }}
                          />
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #d0d0d0", textAlign: "right" }}>
                          ${part.unitPrice}
                        </td>
                        <td style={{ padding: "8px", border: "1px solid #d0d0d0", textAlign: "right" }}>
                          ${(part.quantity * parseFloat(part.unitPrice)).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" style={{ padding: "20px", textAlign: "center", fontStyle: "italic", color: "#777" }}>
                        Enter part number details above to see pricing breakdown
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>



            <div style={{ marginTop: "20px", padding: "15px", background: "#f8f9fa", borderRadius: "4px" }}>
              {(parts.length > 0 && pricingConfig) ? (
                 <CostBreakdown partsTotal={calculateTotal()} config={pricingConfig} />
              ) : (
                <h2 style={{ margin: 0, textAlign: "right" }}>
                    Total: ${calculateTotal()}
                </h2>
              )}
            </div>
          </>
        )}

        {cableType === "Hydraulic Hose" && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Hose Type</label>
              <select
                value={hoseData.hoseType}
                onChange={(e) => setHoseData({ ...hoseData, hoseType: e.target.value, partNumber: "" })}
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              >
                <option value="">Select Hose Type</option>
                <option value="standard">Standard Hose</option>
                <option value="highPressure">High Pressure Hose</option>
              </select>
            </div>

            {hoseData.hoseType && (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Part Number</label>
                  <select
                    value={hoseData.partNumber}
                    onChange={(e) => setHoseData({ ...hoseData, partNumber: e.target.value })}
                    style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                  >
                    <option value="">Select Part Number</option>
                    {priceData.hoses && priceData.hoses[hoseData.hoseType]?.map((hose) => (
                      <option key={`${hose.id}-${hose.partNumber}`} value={hose.partNumber}>
                        {hose.partNumber} - {hose.description} (${hose.unitPrice}/inch)
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Length (inches)</label>
                  <input
                    type="number"
                    value={hoseData.length}
                    onChange={(e) => setHoseData({ ...hoseData, length: e.target.value })}
                    placeholder="Enter length in inches"
                    style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                  />
                </div>
              </>
            )}

            <div style={{ background: "#fff", borderRadius: "4px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ background: "#f1f3f5" }}>
                  <tr>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #dee2e6" }}>Part Description</th>
                    <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #dee2e6" }}>Quantity</th>
                    <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #dee2e6" }}>Unit Price</th>
                    <th style={{ padding: "12px", textAlign: "right", borderBottom: "2px solid #dee2e6" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.length > 0 ? (
                    parts.map((part, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #dee2e6" }}>
                        <td style={{ padding: "12px" }}>{part.partName}</td>
                        <td style={{ padding: "12px", textAlign: "right" }}>
                          <input
                            type="number"
                            min="1"
                            value={part.quantity}
                            onChange={(e) => {
                              const newParts = [...parts];
                              newParts[index].quantity = parseInt(e.target.value) || 1;
                              setParts(newParts);
                            }}
                            style={{ width: "60px", padding: "4px", textAlign: "right", border: "1px solid #ccc", borderRadius: "4px" }}
                          />
                        </td>
                        <td style={{ padding: "12px", textAlign: "right" }}>${part.unitPrice.toFixed(2)}</td>
                        <td style={{ padding: "12px", textAlign: "right", fontWeight: "600" }}>
                          ${(part.quantity * part.unitPrice).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" style={{ padding: "20px", textAlign: "center", fontStyle: "italic", color: "#777" }}>
                        Select hose type and part number above to see pricing
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ marginBottom: "20px", textAlign: "right" }}>
              <button
                onClick={() => setShowAddPartModal(true)}
                style={{
                  padding: "5px 10px",
                  background: "#ffbb00",
                  color: "black",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold"
                }}
              >
                + Add Extra Part
              </button>
            </div>

            <div style={{ marginTop: "20px", padding: "15px", background: "#f8f9fa", borderRadius: "4px" }}>
              {(parts.length > 0 && pricingConfig) ? (
                <CostBreakdown partsTotal={calculateTotal()} config={pricingConfig} />
              ) : (
                <h2 style={{ margin: 0, textAlign: "right" }}>
                  Total: ${calculateTotal()}
                </h2>
              )}
            </div>
          </>
        )}
      </div>
      

      {/* Add Manual Part Modal */}
      {showAddPartModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            padding: "20px",
            borderRadius: "8px",
            width: "400px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            <h3 style={{ marginTop: 0 }}>Add Manual Part</h3>
            
            <div style={{ marginBottom: "15px", position: "relative" }}>
               <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Search Saved Parts (Optional)</label>
               <input
                 type="text"
                 placeholder="Type to search catalog..."
                 value={componentSearchQuery}
                 onChange={(e) => handleComponentSearch(e.target.value)}
                 style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", background: "#f8f9fa" }}
               />
               {componentSearchResults.length > 0 && (
                 <div style={{
                   position: "absolute",
                   top: "100%",
                   left: 0,
                   right: 0,
                   background: "white",
                   border: "1px solid #ddd",
                   borderRadius: "4px",
                   boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                   zIndex: 10,
                   maxHeight: "150px",
                   overflowY: "auto"
                 }}>
                   {componentSearchResults.map(comp => (
                     <div 
                       key={comp.id}
                       onClick={() => selectSavedComponent(comp)}
                       style={{ padding: "8px", borderBottom: "1px solid #eee", cursor: "pointer" }}
                       onMouseEnter={(e) => e.target.style.background = "#f0f0f0"}
                       onMouseLeave={(e) => e.target.style.background = "white"}
                     >
                       <div style={{fontWeight: "bold"}}>{comp.name}</div>
                       <div style={{fontSize: "12px", color: "#666"}}>${comp.unit_price}</div>
                     </div>
                   ))}
                 </div>
               )}
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Part Name / Description</label>
              <input
                type="text"
                value={newManualPart.partName}
                onChange={(e) => setNewManualPart({...newManualPart, partName: e.target.value})}
                placeholder="e.g. Extra Washer"
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Quantity</label>
              <input
                type="number"
                min="1"
                value={newManualPart.quantity}
                onChange={(e) => setNewManualPart({...newManualPart, quantity: parseInt(e.target.value) || 1})}
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={newManualPart.unitPrice}
                onChange={(e) => setNewManualPart({...newManualPart, unitPrice: e.target.value})}
                style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
            </div>
            
            <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                    <input 
                        type="checkbox" 
                        checked={newManualPart.saveToCatalog}
                        onChange={(e) => setNewManualPart({...newManualPart, saveToCatalog: e.target.checked})}
                        style={{ marginRight: "8px" }}
                    />
                    Save this part to catalog for future use?
                </label>
            </div>
            
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                onClick={() => setShowAddPartModal(false)}
                style={{
                  padding: "8px 16px",
                  background: "#eee",
                  color: "#333",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddManualPart}
                style={{
                  padding: "8px 16px",
                  background: "#ffbb00",
                  color: "black",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Add Part
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Price;
