import React, { useState, useEffect } from "react";

const priceData = {
  pushpull: {
    "3": {
      conduit: [
        { partNumber: "X0107", unitPrice: 0.54, description: "3 SERIES CONDUIT - Use .075 Core" },
        { partNumber: "X0108", unitPrice: 0.57, description: "3 SERIES CONDUIT - Use HP Core" },
      ],
      core: [
        { partNumber: "X0002", unitPrice: 0.16, description: "3 SERIES .075 SOLID CORE" },
        { partNumber: "X0109", unitPrice: 0.29, description: "3 SERIES HP CORE" },
      ],
      hubs: {
        bulkhead: { partNumber: "X0110", unitPrice: 1.58, description: "BULKHEAD HUB" },
        clamp: { partNumber: "X0111", unitPrice: 2.22, description: "CLAMP HUB - S.S." },
        combo: { partNumber: "X0112", unitPrice: 7.44, description: "BC COMBO HUB" },
      },
      sleeves: [
        { travel: 1, partNumber: "X0006", unitPrice: 1.21, description: "SLEEVE 1\" TRAVEL" },
        { travel: 2, partNumber: "X0007", unitPrice: 1.24, description: "SLEEVE 2\" TRAVEL" },
        { travel: 3, partNumber: "X0008", unitPrice: 1.26, description: "SLEEVE 3\" TRAVEL" },
        { travel: 4, partNumber: "X0009", unitPrice: 1.37, description: "SLEEVE 4\" TRAVEL" },
        { travel: 5, partNumber: "X0274-1", unitPrice: 1.89, description: "SLEEVE 5\" TRAVEL" },
        { travel: 6, partNumber: "X0300-1", unitPrice: 11.35, description: "SLEEVE 6\" TRAVEL" },
        { travel: 7, partNumber: "X1286-00", unitPrice: 11.51, description: "SLEEVE 7\" TRAVEL" },
      ],
      rods: [
        { travel: 1, partNumber: "X0113", unitPrice: 1.61, description: "ROD 1\" TRAVEL" },
        { travel: 2, partNumber: "X0114", unitPrice: 1.24, description: "ROD 2\" TRAVEL" },
        { travel: 3, partNumber: "X0115", unitPrice: 1.66, description: "ROD 3\" TRAVEL" },
        { travel: 4, partNumber: "X0116", unitPrice: 1.60, description: "ROD 4\" TRAVEL" },
        { travel: 5, partNumber: "X0275-1", unitPrice: 3.40, description: "ROD 5\" TRAVEL" },
        { travel: 6, partNumber: "X0299-1", unitPrice: 4.44, description: "ROD 6\" TRAVEL" },
        { travel: 7, partNumber: "X1285-00", unitPrice: 6.40, description: "ROD 7\" TRAVEL" },
      ],
      hardware: [
        { partNumber: "X0014", unitPrice: 0.07, description: "LOCK WASHER (B-HUBS)" },
        { partNumber: "X0015", unitPrice: 0.05, description: "10/32 ROD NUT: S.S." },
        { partNumber: "X0016", unitPrice: 0.15, description: "ROD SEAL" },
        { partNumber: "X0017", unitPrice: 0.15, description: "SLEEVE SEAL" },
      ],
    },
    "4": {
      conduit: [
        { partNumber: "X0117", unitPrice: 0.67, description: "4 SERIES HP CONDUIT" },
      ],
      core: [
        { partNumber: "X0118", unitPrice: 0.57, description: "4 SERIES HP CORE" },
      ],
      hubs: {
        bulkhead: { partNumber: "X0119", unitPrice: 2.69, description: "BULKHEAD HUB" },
        clamp: { partNumber: "X0120", unitPrice: 0.96, description: "CLAMP HUB" },
        combo: { partNumber: "X0121", unitPrice: 3.94, description: "BC COMBO HUB" },
      },
      sleeves: [
        { travel: 1, partNumber: "X0028", unitPrice: 1.39, description: "SLEEVE 1\" TRAVEL" },
        { travel: 2, partNumber: "X0029", unitPrice: 1.48, description: "SLEEVE 2\" TRAVEL" },
        { travel: 3, partNumber: "X0030", unitPrice: 1.61, description: "SLEEVE 3\" TRAVEL" },
        { travel: 4, partNumber: "X0031", unitPrice: 1.87, description: "SLEEVE 4\" TRAVEL" },
        { travel: 5, partNumber: "X0276-1", unitPrice: 2.18, description: "SLEEVE 5\" TRAVEL" },
        { travel: 6, partNumber: "X0305-1", unitPrice: 4.75, description: "SLEEVE 6\" TRAVEL" },
        { travel: 7, partNumber: "X1288-00", unitPrice: 12.22, description: "SLEEVE 7\" TRAVEL" },
      ],
      rods: [
        { travel: 1, partNumber: "X0122", unitPrice: 2.04, description: "ROD 1\" TRAVEL" },
        { travel: 2, partNumber: "X0123", unitPrice: 1.86, description: "ROD 2\" TRAVEL" },
        { travel: 3, partNumber: "X0124", unitPrice: 2.13, description: "ROD 3\" TRAVEL" },
        { travel: 4, partNumber: "X0125", unitPrice: 2.18, description: "ROD 4\" TRAVEL" },
        { travel: 5, partNumber: "X0277-1", unitPrice: 3.08, description: "ROD 5\" TRAVEL" },
        { travel: 6, partNumber: "X0304-1", unitPrice: 2.90, description: "ROD 6\" TRAVEL" },
        { travel: 7, partNumber: "X1287-00", unitPrice: 6.89, description: "ROD 7\" TRAVEL" },
      ],
      hardware: [
        { partNumber: "X0036", unitPrice: 0.10, description: "LOCKWASHER (B-HUB)" },
        { partNumber: "X0037", unitPrice: 0.05, description: "1/4-28 ROD NUT" },
        { partNumber: "X0038", unitPrice: 0.29, description: "ROD SEAL" },
        { partNumber: "X0039", unitPrice: 0.18, description: "SLEEVE SEAL" },
      ],
    },
    "6": {
      conduit: [
        { partNumber: "X0126", unitPrice: 0.80, description: "6 SERIES HP CONDUIT" },
      ],
      core: [
        { partNumber: "X0127", unitPrice: 0.71, description: "6 SERIES HP CORE" },
      ],
      hubs: {
        bulkhead: { partNumber: "X0128", unitPrice: 2.72, description: "BULKHEAD HUB" },
        clamp: { partNumber: "X0129", unitPrice: 1.81, description: "CLAMP HUB" },
        combo: { partNumber: "X0130", unitPrice: 6.49, description: "BC COMBO HUB" },
      },
      sleeves: [
        { travel: 1, partNumber: "X0047", unitPrice: 1.59, description: "SLEEVE 1\" TRAVEL" },
        { travel: 2, partNumber: "X0048", unitPrice: 1.63, description: "SLEEVE 2\" TRAVEL" },
        { travel: 3, partNumber: "X0049", unitPrice: 1.85, description: "SLEEVE 3\" TRAVEL" },
        { travel: 4, partNumber: "X0050", unitPrice: 2.15, description: "SLEEVE 4\" TRAVEL" },
        { travel: 5, partNumber: "X0278-1", unitPrice: 2.38, description: "SLEEVE 5\" TRAVEL" },
      ],
      rods: [
        { travel: 1, partNumber: "X0131", unitPrice: 3.03, description: "ROD 1\" TRAVEL" },
        { travel: 2, partNumber: "X0132", unitPrice: 2.48, description: "ROD 2\" TRAVEL" },
        { travel: 3, partNumber: "X0133", unitPrice: 2.87, description: "ROD 3\" TRAVEL" },
        { travel: 4, partNumber: "X0134", unitPrice: 3.61, description: "ROD 4\" TRAVEL" },
        { travel: 5, partNumber: "X0279-1", unitPrice: 4.53, description: "ROD 5\" TRAVEL" },
      ],
      hardware: [
        { partNumber: "X0055", unitPrice: 0.27, description: "LOCKWASHERS (B-HUB)" },
        { partNumber: "X0056", unitPrice: 0.07, description: "5/16-24 ROD NUT" },
        { partNumber: "X0057", unitPrice: 0.20, description: "ROD SEAL" },
        { partNumber: "X0058", unitPrice: 0.19, description: "SLEEVE SEAL" },
      ],
    },
  },
  hoses: {
    standard: [
      { partNumber: "4", description: "1/4 inch Hydraulic Hose", unitPrice: 0.61 },
      { partNumber: "6", description: "3/8 inch Hydraulic Hose", unitPrice: 0.74 },
      { partNumber: "8", description: "1/2 inch Hydraulic Hose", unitPrice: 0.93 },
      { partNumber: "10", description: "5/8 inch Hydraulic Hose", unitPrice: 1.00 },
      { partNumber: "12", description: "3/4 inch Hydraulic Hose", unitPrice: 1.33 },
      { partNumber: "16", description: "1 inch Hydraulic Hose", unitPrice: 1.70 },
    ],
    highPressure: [
      { partNumber: "4", description: "1/4 inch Hydraulic Hose", unitPrice: 0.92 },
      { partNumber: "6", description: "3/8 inch Hydraulic Hose", unitPrice: 1.11 },
      { partNumber: "8", description: "1/2 inch Hydraulic Hose", unitPrice: 1.25 },
      { partNumber: "10", description: "5/8 inch Hydraulic Hose", unitPrice: 1.46 },
      { partNumber: "12", description: "3/4 inch Hydraulic Hose", unitPrice: 2.00 },
      { partNumber: "16", description: "1 inch Hydraulic Hose", unitPrice: 2.55 },
    ],
  },
};

const NewPrice = () => {
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

export default NewPrice;
