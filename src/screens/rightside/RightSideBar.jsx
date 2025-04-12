import React, {useState, useEffect} from 'react'
import "./rightsidebar.css"
import Navbar from '../../components/navbar/Navbar'
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Calendar02Icon, FireIcon, ZapIcon, Coffee02Icon, GridViewIcon, LeftToRightListBulletIcon, MoreHorizontalIcon } from '@hugeicons/core-free-icons';
import Priority from '../../components/priority/Priority';
import Modal from 'react-bootstrap/Modal';
import RepairSelector from '../../components/repairs/Repairs';
import PartSelector from '../../components/repairs/Parts';
import ProgressFilter from '../../components/progressfilter/ProgressFilter';
import Pagination from 'react-bootstrap/Pagination';

const RightSideBar = () => {

  const [currentPage, setCurrentPage] = useState(1);


  const [viewMode, setViewMode] = useState("table");

  const [repairs, setRepairs] = useState([]);

  const [parts, setParts] = useState([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showInfo, setShowInfo] = useState(false);

  const handleClose1 = () => setShowInfo(false);
  const handleShow1 = () => setShowInfo(true);


  const [showEditForm, setShowEditForm] = useState(false);

  const handleCloseEditForm = () => setShowEditForm(false);
  const handleShowEditForm = () => setShowEditForm(true);

  const [formData, setFormData] = useState({
    customerName: '',
    dateIn: '',
    progress: 'New',
    priority: 'Low',
    comments: '',
  });



  const [selectedItem, setSelectedItem] = useState({});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const finalData = {
      ...formData,
      repairs,
    };
    setShow(false);
    console.log(finalData);
    // You can now send this data to your backend or store it
  };

  const handleDelete = (id) => {
    const filteredData = tableData.filter(item => item.id !== id);
    // If you're storing this data somewhere, update that source too
    console.log("Deleted ID:", id);
    handleClose1();
  };
  
  const handleEdit = (item) => {
    setSelectedItem(item); // Store the selected item in state
    setFormData({
      customerName: item.customerName || '',
      dateIn: item.dateIn || '',
      dateOut: item.dateOut || '',
      progress: item.progress || '',
      partsNeeded: item.partsNeeded || [],
      comments: item.comments || '',
      priority: item.priority || '',
    });
    setRepairs(item.repairNeeded || []);
    setShowEditForm(true); // Show the edit modal
  };
  
  const countByStatus = (status) =>
    tableData.filter((item) => item.progress.toLowerCase() === status.toLowerCase()).length;
  
  

  const tableData = [
    {
      id: 1,
      customerName: "John Doe",
      dateIn: "2025-04-10",
      dateOut: "2025-04-12",
      progress: "In Progress",
      repairNeeded: ['axle', 'brakes', 'electrical'],
      partsNeeded: ['bearings', 'seals', 'drums', 'axle'],
      priority: "High",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      dateIn: "2025-04-09",
      dateOut: "2025-04-11",
      progress: "Pending",
      repairNeeded: ['lights'],
      partsNeeded: ['bulbs', 'wiring'],
      priority: "Medium",
    },
    {
      id: 3,
      customerName: "Carlos Garcia",
      dateIn: "2025-04-08",
      dateOut: "2025-04-10",
      progress: "Completed",
      repairNeeded: ['frame alignment'],
      partsNeeded: ['steel beam'],
      priority: "Low",
    },
    {
      id: 4,
      customerName: "Angela White",
      dateIn: "2025-04-07",
      dateOut: "2025-04-09",
      progress: "In Progress",
      repairNeeded: ['tires'],
      partsNeeded: ['tire set'],
      priority: "High",
    },
    {
      id: 5,
      customerName: "Tom Briggs",
      dateIn: "2025-04-06",
      dateOut: "2025-04-08",
      progress: "Pending",
      repairNeeded: ['wiring'],
      partsNeeded: ['wiring set'],
      priority: "Medium",
    },
    {
      id: 6,
      customerName: "Linda James",
      dateIn: "2025-04-05",
      dateOut: "2025-04-07",
      progress: "Completed",
      repairNeeded: ['hitch install'],
      partsNeeded: ['hitch'],
      priority: "High",
    },
    {
      id: 7,
      customerName: "Peter Vaughn",
      dateIn: "2025-04-04",
      dateOut: "2025-04-06",
      progress: "In Progress",
      repairNeeded: ['suspension'],
      partsNeeded: ['springs'],
      priority: "Low",
    },
    {
      id: 8,
      customerName: "Sasha Reed",
      dateIn: "2025-04-03",
      dateOut: "2025-04-05",
      progress: "Pending",
      repairNeeded: ['door repair'],
      partsNeeded: ['door hinges'],
      priority: "Medium",
    },
    {
      id: 9,
      customerName: "Mohammed Ali",
      dateIn: "2025-04-02",
      dateOut: "2025-04-04",
      progress: "Completed",
      repairNeeded: ['roof repair'],
      partsNeeded: ['panels'],
      priority: "High",
    },
    {
      id: 10,
      customerName: "Emily Clark",
      dateIn: "2025-04-01",
      dateOut: "2025-04-03",
      progress: "In Progress",
      repairNeeded: ['flooring'],
      partsNeeded: ['wood boards'],
      priority: "Low",
    },
    {
      id: 1,
      customerName: "John Doe",
      dateIn: "2025-04-10",
      dateOut: "2025-04-12",
      progress: "In Progress",
      repairNeeded: ['axle', 'brakes', 'electrical'],
      partsNeeded: ['bearings', 'seals', 'drums', 'axle'],
      priority: "High",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      dateIn: "2025-04-09",
      dateOut: "2025-04-11",
      progress: "Pending",
      repairNeeded: ['lights'],
      partsNeeded: ['bulbs', 'wiring'],
      priority: "Medium",
    },
    {
      id: 3,
      customerName: "Carlos Garcia",
      dateIn: "2025-04-08",
      dateOut: "2025-04-10",
      progress: "Completed",
      repairNeeded: ['frame alignment'],
      partsNeeded: ['steel beam'],
      priority: "Low",
    },
    {
      id: 4,
      customerName: "Angela White",
      dateIn: "2025-04-07",
      dateOut: "2025-04-09",
      progress: "In Progress",
      repairNeeded: ['tires'],
      partsNeeded: ['tire set'],
      priority: "High",
    },
    {
      id: 5,
      customerName: "Tom Briggs",
      dateIn: "2025-04-06",
      dateOut: "2025-04-08",
      progress: "Pending",
      repairNeeded: ['wiring'],
      partsNeeded: ['wiring set'],
      priority: "Medium",
    },
    {
      id: 6,
      customerName: "Linda James",
      dateIn: "2025-04-05",
      dateOut: "2025-04-07",
      progress: "Completed",
      repairNeeded: ['hitch install'],
      partsNeeded: ['hitch'],
      priority: "High",
    },
    {
      id: 7,
      customerName: "Peter Vaughn",
      dateIn: "2025-04-04",
      dateOut: "2025-04-06",
      progress: "In Progress",
      repairNeeded: ['suspension'],
      partsNeeded: ['springs'],
      priority: "Low",
    },
    {
      id: 1,
      customerName: "John Doe",
      dateIn: "2025-04-10",
      dateOut: "2025-04-12",
      progress: "In Progress",
      repairNeeded: ['axle', 'brakes', 'electrical'],
      partsNeeded: ['bearings', 'seals', 'drums', 'axle'],
      priority: "High",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      dateIn: "2025-04-09",
      dateOut: "2025-04-11",
      progress: "Pending",
      repairNeeded: ['lights'],
      partsNeeded: ['bulbs', 'wiring'],
      priority: "Medium",
    },
    {
      id: 3,
      customerName: "Carlos Garcia",
      dateIn: "2025-04-08",
      dateOut: "2025-04-10",
      progress: "Completed",
      repairNeeded: ['frame alignment'],
      partsNeeded: ['steel beam'],
      priority: "Low",
    },
    {
      id: 4,
      customerName: "Angela White",
      dateIn: "2025-04-07",
      dateOut: "2025-04-09",
      progress: "In Progress",
      repairNeeded: ['tires'],
      partsNeeded: ['tire set'],
      priority: "High",
    },
    {
      id: 5,
      customerName: "Tom Briggs",
      dateIn: "2025-04-06",
      dateOut: "2025-04-08",
      progress: "Pending",
      repairNeeded: ['wiring'],
      partsNeeded: ['wiring set'],
      priority: "Medium",
    },
    {
      id: 6,
      customerName: "Linda James",
      dateIn: "2025-04-05",
      dateOut: "2025-04-07",
      progress: "Completed",
      repairNeeded: ['hitch install'],
      partsNeeded: ['hitch'],
      priority: "High",
    },
    {
      id: 7,
      customerName: "Peter Vaughn",
      dateIn: "2025-04-04",
      dateOut: "2025-04-06",
      progress: "In Progress",
      repairNeeded: ['suspension'],
      partsNeeded: ['springs'],
      priority: "Low",
    },
  ];

      const getPriorityStyles = (priority) => {
        switch (priority) {
          case "High":
            return { color: "red", bgColor: "#FFF2F2", icon: FireIcon  };
          
          case "Medium":
            return { color: "orange", bgColor: "lightyellow", icon: ZapIcon };
          case "Low":
            return { color: "green", bgColor: "#EAFAEA", icon: Coffee02Icon };
          default:
            return { color: "black", bgColor: "white" };
        }
      };

      const itemsPerPage = 12;

      const paginatedData = tableData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

      // useEffect(() => {
      //   setCurrentPage(1);
      // }, [selectedStatus, isFiltered, isGridView]);
    
  return (
    
    <div className='rightsidebar'>
        <div className="rightsidebar-container">
            <Navbar />
            <div className="rightsidebar-bottom">
                <div className="rightsidebar-navbar">
                    <h3>Total Trailer</h3>
                    <div className="rightsidebar-button" onClick={handleShow}>
                    <HugeiconsIcon icon={Add01Icon} size={16} color='#ffffff' strokeWidth={3}/>
                    <p>New Repair</p>
                </div>
                </div>
                <div className="rightsidebar-filter">
                    <div className="rightsidebar-filter-button">
                        <div className="custom-filter-button" onClick={() => setViewMode("table")} >
                        <HugeiconsIcon icon={LeftToRightListBulletIcon} size={14} color='#545454'/>
                            <p>List</p>
                        </div>
                        <div className="custom-filter-button" onClick={() => setViewMode("grid")}  >
                        <HugeiconsIcon icon={GridViewIcon} size={14} color='#545454'/>
                            <p>Grid</p>
                        </div>
                    </div>
                    <div className="rightsidebar-filter-date">
                        <div className="custom-filter-button filter-date" onClick={() => setViewMode("table")} >
                        <HugeiconsIcon icon={Calendar02Icon} size={14} color='#545454'/>
                            <p>Sort by date</p>
                        </div>
                    </div>
                </div>
              
                <div className="custom-line no-margin"></div>
                <div className="rightsidebar-filter-progress">
                <ProgressFilter title={'New'} count={countByStatus('New')} />
<ProgressFilter title={'In progress'} count={countByStatus('In Progress')} />
<ProgressFilter title={'Repair done'} count={countByStatus('Repair Done')} />
<ProgressFilter title={'Called'} count={countByStatus('Called')} />
<ProgressFilter title={'Pending'} count={countByStatus('Pending')} />
<ProgressFilter title={'Completed'} count={countByStatus('Completed')} />

                 
                  </div>
                <div className="rightsidebar-table">
                {viewMode === "table" ? (
        <div className="rightsidebar-table">
          <table className="custom-table">
            <thead>
              <tr>
                <th>s/n</th>
                <th>Customer Name</th>
                <th>Date-In</th>
                <th>Date-Out</th>
                <th>Progress</th>
                <th>Repair Needed</th>
                <th>Parts Needed</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
  {paginatedData.map((item)=> {
    const { color, bgColor, icon } = getPriorityStyles(item.priority);
    return (
      <tr key={item.id} onClick={() => {
        setSelectedItem(item);
        handleShow1();
      }}>
        <td>{item.id}</td>
        <td>{item.customerName}</td>
        <td>{item.dateIn}</td>
        <td>{item.dateOut}</td>
        <td>{item.progress}</td>
        <td>{Array.isArray(item.repairNeeded) ? item.repairNeeded.join(', ') : item.repairNeeded}</td>
        <td>{Array.isArray(item.partsNeeded) ? item.partsNeeded.join(', ') : item.partsNeeded}</td>
        <td>
          <Priority
            color={color}
            bgColor={bgColor}
            icon={icon}
            title={item.priority}
          />
        </td>
      </tr>
    );
  })}
</tbody>

          </table>
          <div className="custom-grid-pagination table">
          <Pagination>
                  <Pagination.First />
                  <Pagination.Prev />
                  <Pagination.Item>{1}</Pagination.Item>
                  <Pagination.Ellipsis />
                  <Pagination.Item>{10}</Pagination.Item>
                  <Pagination.Item>{11}</Pagination.Item>
                  <Pagination.Item active>{12}</Pagination.Item>
                  <Pagination.Item>{13}</Pagination.Item>
                  <Pagination.Item disabled>{14}</Pagination.Item>
                  <Pagination.Ellipsis />
                  <Pagination.Item>{20}</Pagination.Item>
                  <Pagination.Next />
                  <Pagination.Last />
                </Pagination>
                </div>
        </div>
      ) : (
        <div className="gridview-container">
           <div className="grid-view">
          {paginatedData.map((item) => {
            const { color, bgColor, icon } = getPriorityStyles(item.priority);
            return (
              <div key={item.id} className="custom-grid" onClick={() => {
                setSelectedItem(item);
                handleShow1();
              }}>
                <div className="custom-grid-top-container">
                  <Priority
                    color={color}
                    bgColor={bgColor}
                    icon={icon}
                    title={item.priority}
                  />
                  <div className="custom-grid-edit">
                    <HugeiconsIcon icon={MoreHorizontalIcon} size={20} />
                  </div>
                </div>
                <div className="custom-grid-bottom-container">
                  <h3>{item.customerName}</h3>
                  <p>
                    Repairs: {Array.isArray(item.repairNeeded) ? item.repairNeeded.join(', ') : item.repairNeeded}
                  </p>
                  <p>
                    Parts: {Array.isArray(item.partsNeeded) ? item.partsNeeded.join(', ') : item.partsNeeded}
                  </p>
                  <div className="custom-line"></div>
                  <div className="custom-grid-bottom-date">
                    <p>{item.dateIn}</p>
                    <p>{item.progress}</p>
                  </div>
                </div>
              </div>
            );
          })}
         
        </div>
        <div className="custom-grid-pagination">
        <Pagination>
            <Pagination.First />
            <Pagination.Prev />
            <Pagination.Item>{1}</Pagination.Item>
            <Pagination.Ellipsis />
            <Pagination.Item>{10}</Pagination.Item>
            <Pagination.Item>{11}</Pagination.Item>
            <Pagination.Item active>{12}</Pagination.Item>
            <Pagination.Item>{13}</Pagination.Item>
            <Pagination.Item disabled>{14}</Pagination.Item>
            <Pagination.Ellipsis />
            <Pagination.Item>{20}</Pagination.Item>
            <Pagination.Next />
            <Pagination.Last />
          </Pagination>
        </div>
        </div>
       
      )}
      
      </div>
               
            </div>
        </div>
        <Modal
  show={show}
  onHide={handleClose}
  backdrop="static"
  keyboard={false}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>Add New Task</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <form className="custom-form">
    <div className="form-group">
      <label>Customer Name</label>
      <input
        type="text"
        name="customerName"
        className="input-field"
        value={formData.customerName}
        onChange={handleChange}
      />
    </div>
    <div className="form-group">
      <label>Date In</label>
      <input
        type="date"
        name="dateIn"
        className="input-field"
        value={formData.dateIn}
        onChange={handleChange}
      />
    </div>
    <div className="form-group">
      <label>Status</label>
      <select
        name="progress"
        className="input-field"
        value={formData.progress}
        onChange={handleChange}
      >
        <option>New</option>
        <option>In Progress</option>
        <option>Repair Done</option>
        <option>Called</option>
        <option>Pending</option>
        <option>Completed</option>
      </select>
    </div>
    <div className="form-group">
      <RepairSelector selectedRepairs={repairs} setSelectedRepairs={setRepairs} />
      <p>Selected Repairs: {repairs.join(', ')}</p>
    </div>
    <div className="form-group">
      <label>Priority</label>
      <select
        name="priority"
        className="input-field"
        value={formData.priority}
        onChange={handleChange}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
    </div>
    <div className="form-group">
      <label>Comments</label>
      <textarea
        name="comments"
        className="input-field textarea"
        value={formData.comments}
        onChange={handleChange}
      />
    </div>
  </form>
</Modal.Body>

  <Modal.Footer>
    <button className="btn-secondary" onClick={handleClose}>Cancel</button>
    <button className="btn-primary " onClick={handleSubmit}>Save</button>
  </Modal.Footer>
</Modal>

{/* Info stuff */}

<Modal
  show={showInfo}
  onHide={handleClose1}
  backdrop="static"
  keyboard={false}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>Task Details</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <div className="info-group">
      <strong>Customer Name:</strong>
      <p>{selectedItem.customerName}</p>
    </div>
    <div className="info-group">
      <strong>Date In:</strong>
      <p>{selectedItem.dateIn}</p>
    </div>
    <div className="info-group">
      <strong>Date Out:</strong>
      <p>{selectedItem.dateOut}</p>
    </div>
    <div className="info-group">
      <strong>Status:</strong>
      <p>{selectedItem.progress}</p>
    </div>
    <div className="info-group">
      <strong>Repairs Needed:</strong>
      <p>{Array.isArray(selectedItem.repairNeeded) ? selectedItem.repairNeeded.join(', ') : selectedItem.repairNeeded}</p>
    </div>
    <div className="info-group">
      <strong>Parts Needed:</strong>
      <p>{Array.isArray(selectedItem.partsNeeded) ? selectedItem.partsNeeded.join(', ') : selectedItem.partsNeeded}</p>
    </div>
    <div className="info-group">
      <strong>Priority:</strong>
      <p>{selectedItem.priority}</p>
    </div>
    {selectedItem.comments && (
      <div className="info-group">
        <strong>Comments:</strong>
        <p>{selectedItem.comments}</p>
      </div>
    )}
  </Modal.Body>

  <Modal.Footer>
    <button className="btn-secondary" onClick={handleClose1}>Cancel</button>
    <button className="btn-danger" onClick={() => handleDelete(selectedItem.id)}>Delete</button>
    <button className="btn-primary" onClick={() => handleEdit(selectedItem)}>Edit</button>

  </Modal.Footer>
</Modal>

<Modal
  show={showEditForm}
  onHide={handleCloseEditForm}
  backdrop="static"
  keyboard={false}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title>Edit Task</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <form className="custom-form">
    <div className="form-group">
      <label>Customer Name</label>
      <input
        type="text"
        name="customerName"
        className="input-field"
        value={formData.customerName}
        onChange={handleChange}
      />
    </div>
    <div className="form-group">
      <label>Date In</label>
      <input
        type="date"
        name="dateIn"
        className="input-field"
        value={formData.dateIn}
        onChange={handleChange}
      />
    </div>
    <div className="form-group">
      <label>Date Out</label>
      <input
        type="date"
        name="dateOut"
        className="input-field"
        value={formData.dateOut}
        onChange={handleChange}
      />
    </div>
    <div className="form-group">
      <label>Status</label>
      <select
        name="progress"
        className="input-field"
        value={formData.progress}
        onChange={handleChange}
      >
        <option>New</option>
        <option>In Progress</option>
        <option>Repair Done</option>
        <option>Called</option>
        <option>Pending</option>
        <option>Completed</option>
      </select>
    </div>
    <div className="form-group">
      <RepairSelector selectedRepairs={repairs} setSelectedRepairs={setRepairs} />
      <p>Selected Repairs: {repairs.join(' ')}</p>
    </div>
    <div className="form-group">
      <PartSelector selectedParts={parts} setSelectedParts={setParts} />
      <p>Selected Parts: {parts.join(' ')}</p>
    </div>
    <div className="form-group">
      <label>Priority</label>
      <select
        name="priority"
        className="input-field"
        value={formData.priority}
        onChange={handleChange}
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
    </div>
    <div className="form-group">
      <label>Comments</label>
      <textarea
        name="comments"
        className="input-field textarea"
        value={formData.comments}
        onChange={handleChange}
      />
    </div>
  </form>
</Modal.Body>

  <Modal.Footer>
    <button className="btn-secondary" onClick={handleClose}>Cancel</button>
    <button className="btn-primary " onClick={handleSubmit}>Save</button>
  </Modal.Footer>
</Modal>

    </div>
  )
}


export default RightSideBar

