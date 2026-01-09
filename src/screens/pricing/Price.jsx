import React, { useState, useEffect } from "react";

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
  const [showModal, setShowModal] = useState(false);
  const [newPart, setNewPart] = useState({ name: "", partNumber: "", quantity: 1, unitPrice: 0 });
  
  const { transformedData: priceData, loading } = usePricing();

  useEffect(() => {
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
        quantity: 1,
        unitPrice: (conduit.unitPrice * lengthInches).toFixed(2),
        description: conduit.description,
      });
    }

    if (seriesData.core.length > 0) {
      const core = seriesData.core[0];
      calculatedParts.push({
        partName: "Core",
        partNumber: core.partNumber,
        quantity: 1,
        unitPrice: (core.unitPrice * lengthInches).toFixed(2),
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
        quantity: 1,
        unitPrice: sleeve.unitPrice.toFixed(2),
        description: sleeve.description,
      });
    }

    const rod = seriesData.rods.find((r) => r.travel === travelInches);
    if (rod) {
      calculatedParts.push({
        partName: `Rod ${travelInches}" Travel`,
        partNumber: rod.partNumber,
        quantity: 1,
        unitPrice: rod.unitPrice.toFixed(2),
        description: rod.description,
      });
    }

    calculatedParts.push({
      partName: "Rod Nut",
      partNumber: seriesData.hardware[1].partNumber,
      quantity: 1,
      unitPrice: seriesData.hardware[1].unitPrice.toFixed(2),
      description: seriesData.hardware[1].description,
    });

    calculatedParts.push({
      partName: "Rod Seal",
      partNumber: seriesData.hardware[2].partNumber,
      quantity: 1,
      unitPrice: seriesData.hardware[2].unitPrice.toFixed(2),
      description: seriesData.hardware[2].description,
    });

    calculatedParts.push({
      partName: "Sleeve Seal",
      partNumber: seriesData.hardware[3].partNumber,
      quantity: 1,
      unitPrice: seriesData.hardware[3].unitPrice.toFixed(2),
      description: seriesData.hardware[3].description,
    });

    setParts(calculatedParts);
  }, [partNumberData]);

  const handlePartNumberChange = (field, value) => {
    setPartNumberData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateTotal = () => {
    return parts.reduce((sum, part) => sum + parseFloat(part.unitPrice) * part.quantity, 0).toFixed(2);
  };

  const fullPartNumber = `${partNumberData.prefix}-${partNumberData.type}${partNumberData.series}${partNumberData.travel}${partNumberData.fitting1}${partNumberData.fitting2}-${partNumberData.length.padStart(4, "0")}`;

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ background: "#f8f9fa", padding: "15px", marginBottom: "20px", borderRadius: "8px" }}>
        <h2 style={{ margin: "0 0 10px 0" }}>Madison Generator - Pricing</h2>
      </div>

      <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
       {/*} <h3>Price Calculator</h3>
        <hr />

        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Type of Cable</label>
          <select
            value={cableType}
            onChange={(e) => setCableType(e.target.value)}
            style={{ width: "100%", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            <option>Push-pull cable</option>
            <option>Hydraulic Hose</option>
          </select>
        </div>*/}

        {cableType === "Push-pull cable" && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Part Number</label>
              <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                <input
                  type="text"
                  value={partNumberData.prefix}
                  disabled
                  style={{ width: "60px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", background: "#e9ecef" }}
                />
                <span>-</span>
                <input
                  type="text"
                  value={partNumberData.type}
                  disabled
                  style={{ width: "40px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px", background: "#e9ecef" }}
                />
                <input
                  type="text"
                  placeholder="Series (3,4,6)"
                  value={partNumberData.series}
                  onChange={(e) => handlePartNumberChange("series", e.target.value)}
                  maxLength="1"
                  style={{ width: "80px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
                <input
                  type="text"
                  placeholder="Travel (1-7)"
                  value={partNumberData.travel}
                  onChange={(e) => handlePartNumberChange("travel", e.target.value)}
                  maxLength="1"
                  style={{ width: "80px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
                <input
                  type="text"
                  placeholder="Fit1 (2,3,5)"
                  value={partNumberData.fitting1}
                  onChange={(e) => handlePartNumberChange("fitting1", e.target.value)}
                  maxLength="1"
                  style={{ width: "80px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
                <input
                  type="text"
                  placeholder="Fit2 (2,3,5)"
                  value={partNumberData.fitting2}
                  onChange={(e) => handlePartNumberChange("fitting2", e.target.value)}
                  maxLength="1"
                  style={{ width: "80px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
                <span>-</span>
                <input
                  type="text"
                  placeholder="Length (inches)"
                  value={partNumberData.length}
                  onChange={(e) => handlePartNumberChange("length", e.target.value)}
                  maxLength="4"
                  style={{ width: "100px", padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                />
              </div>
              <div style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
                <strong>Part Number:</strong> {fullPartNumber}
              </div>
              <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
                Series: 3,4,6 | Travel: 1-7 inches | Fitting: 2=Bulkhead, 3=Clamp, 5=Combo
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>Parts Breakdown</label>
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
                        <td style={{ padding: "8px", border: "1px solid #d0d0d0" }}>{part.quantity}</td>
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
              <h2 style={{ margin: 0, textAlign: "right" }}>
                Total: ${calculateTotal()}
              </h2>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Price;
