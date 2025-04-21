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
import Order from '../order/Order';

const tableData = [
  // Pending (6)
  // {
  //   id: 1, customerName: 'Angela White', dateIn: '2025-04-01', dateOut: '2025-04-03',
  //   progress: 'Pending', repairNeeded: ['flooring'], partsNeeded: ['bearings', 'seals'], priority: 'Low',
  // },
  // {
  //   id: 2, customerName: 'Tom Briggs', dateIn: '2025-04-02', dateOut: '2025-04-04',
  //   progress: 'Pending', repairNeeded: ['roof repair'], partsNeeded: ['panels'], priority: 'High',
  // },
  // {
  //   id: 3, customerName: 'Sasha Reed', dateIn: '2025-04-03', dateOut: '2025-04-05',
  //   progress: 'Pending', repairNeeded: ['brakes'], partsNeeded: ['brake pads'], priority: 'Medium',
  // },
  // {
  //   id: 4, customerName: 'Jane Smith', dateIn: '2025-04-04', dateOut: '2025-04-06',
  //   progress: 'Pending', repairNeeded: ['lights'], partsNeeded: ['LED bulbs'], priority: 'High',
  // },
  // {
  //   id: 5, customerName: 'Ben Lewis', dateIn: '2025-04-05', dateOut: '2025-04-07',
  //   progress: 'Pending', repairNeeded: ['wiring'], partsNeeded: ['cables'], priority: 'High',
  // },
  // {
  //   id: 6, customerName: 'Tina Moon', dateIn: '2025-04-06', dateOut: '2025-04-08',
  //   progress: 'Pending', repairNeeded: ['fender'], partsNeeded: ['fender'], priority: 'Medium',
  // },

  // In Progress (6)
  {
    id: 7, customerName: 'Emily Clark', dateIn: '2025-04-07', dateOut: '2025-04-09',
    progress: 'In Progress', repairNeeded: ['door'], partsNeeded: ['hinges'], priority: 'Medium',
  },
  {
    id: 8, customerName: 'Peter Vaughn', dateIn: '2025-04-08', dateOut: '2025-04-10',
    progress: 'In Progress', repairNeeded: ['suspension'], partsNeeded: ['springs'], priority: 'Low',
  },
  {
    id: 9, customerName: 'Carlos Garcia', dateIn: '2025-04-09', dateOut: '2025-04-11',
    progress: 'In Progress', repairNeeded: ['frame'], partsNeeded: ['beam'], priority: 'Low',
  },
  {
    id: 10, customerName: 'Nick Johnson', dateIn: '2025-04-10', dateOut: '2025-04-12',
    progress: 'In Progress', repairNeeded: ['electrical'], partsNeeded: ['fuse'], priority: 'Medium',
  },
  {
    id: 11, customerName: 'Marcus Grant', dateIn: '2025-04-11', dateOut: '2025-04-13',
    progress: 'In Progress', repairNeeded: ['door'], partsNeeded: ['latch'], priority: 'Medium',
  },
  {
    id: 12, customerName: 'Oliver West', dateIn: '2025-04-12', dateOut: '2025-04-14',
    progress: 'In Progress', repairNeeded: ['suspension'], partsNeeded: ['springs'], priority: 'Medium',
  },

  // Completed (6)
  {
    id: 13, customerName: 'Mohammed Ali', dateIn: '2025-04-13', dateOut: '2025-04-15',
    progress: 'Completed', repairNeeded: ['roof'], partsNeeded: ['panels'], priority: 'High',
  },
  {
    id: 14, customerName: 'Linda James', dateIn: '2025-04-14', dateOut: '2025-04-16',
    progress: 'Completed', repairNeeded: ['hitch'], partsNeeded: ['hitch'], priority: 'Medium',
  },
  {
    id: 15, customerName: 'John Doe', dateIn: '2025-04-15', dateOut: '2025-04-17',
    progress: 'Completed', repairNeeded: ['axle'], partsNeeded: ['axle'], priority: 'High',
  },
  {
    id: 16, customerName: 'Kelly Black', dateIn: '2025-04-16', dateOut: '2025-04-18',
    progress: 'Completed', repairNeeded: ['suspension'], partsNeeded: ['shocks'], priority: 'Low',
  },
  {
    id: 17, customerName: 'Rachel Adams', dateIn: '2025-04-17', dateOut: '2025-04-19',
    progress: 'Completed', repairNeeded: ['brakes'], partsNeeded: ['pads'], priority: 'High',
  },
  {
    id: 18, customerName: 'Max Wells', dateIn: '2025-04-18', dateOut: '2025-04-20',
    progress: 'Completed', repairNeeded: ['lighting'], partsNeeded: ['light bar'], priority: 'High',
  },

  // // New (6)
  {
    id: 19, customerName: 'Kate Lynn', dateIn: '2025-04-19', dateOut: '2025-04-21',
    progress: 'New', repairNeeded: ['inspection'], partsNeeded: [], priority: 'Low',
  },
  // {
  //   id: 20, customerName: 'Sam Carter', dateIn: '2025-04-20', dateOut: '2025-04-22',
  //   progress: 'New', repairNeeded: ['hitch install'], partsNeeded: ['hitch kit'], priority: 'High',
  // },
  // {
  //   id: 21, customerName: 'Derek Miles', dateIn: '2025-04-21', dateOut: '2025-04-23',
  //   progress: 'New', repairNeeded: ['battery check'], partsNeeded: ['battery'], priority: 'Medium',
  // },
  // {
  //   id: 22, customerName: 'Amber Stone', dateIn: '2025-04-22', dateOut: '2025-04-24',
  //   progress: 'New', repairNeeded: ['seal test'], partsNeeded: ['gasket'], priority: 'Low',
  // },
  // {
  //   id: 23, customerName: 'Zack Rollins', dateIn: '2025-04-23', dateOut: '2025-04-25',
  //   progress: 'New', repairNeeded: ['frame check'], partsNeeded: [], priority: 'Low',
  // },
  // {
  //   id: 24, customerName: 'Nina Hart', dateIn: '2025-04-24', dateOut: '2025-04-26',
  //   progress: 'New', repairNeeded: ['door repair'], partsNeeded: ['door panel'], priority: 'Medium',
  // },

  // Called (6)
  // {
  //   id: 25, customerName: 'Joe Banner', dateIn: '2025-04-25', dateOut: '2025-04-27',
  //   progress: 'Called', repairNeeded: ['quote review'], partsNeeded: [], priority: 'Medium',
  // },
  // {
  //   id: 26, customerName: 'Kyla Fox', dateIn: '2025-04-26', dateOut: '2025-04-28',
  //   progress: 'Called', repairNeeded: ['tire replacement'], partsNeeded: ['tires'], priority: 'High',
  // },
  // {
  //   id: 27, customerName: 'Matt Davis', dateIn: '2025-04-27', dateOut: '2025-04-29',
  //   progress: 'Called', repairNeeded: ['inspection'], partsNeeded: [], priority: 'Low',
  // },
  // {
  //   id: 28, customerName: 'Helen Cross', dateIn: '2025-04-28', dateOut: '2025-04-30',
  //   progress: 'Called', repairNeeded: ['roof check'], partsNeeded: [], priority: 'Low',
  // },
  // {
  //   id: 29, customerName: 'Isaac Ray', dateIn: '2025-04-29', dateOut: '2025-05-01',
  //   progress: 'Called', repairNeeded: ['axle replacement'], partsNeeded: ['axle'], priority: 'High',
  // },
  // {
  //   id: 30, customerName: 'Donna Glenn', dateIn: '2025-04-30', dateOut: '2025-05-02',
  //   progress: 'Called', repairNeeded: ['seal check'], partsNeeded: [], priority: 'Medium',
  // },

  // Repair Done (6)
  {
    id: 31, customerName: 'Leo Burns', dateIn: '2025-05-01', dateOut: '2025-05-03',
    progress: 'Repair Done', repairNeeded: ['brake job'], partsNeeded: ['pads', 'rotors'], priority: 'High',
  },
  {
    id: 32, customerName: 'Nora West', dateIn: '2025-05-02', dateOut: '2025-05-04',
    progress: 'Repair Done', repairNeeded: ['electrical'], partsNeeded: ['switch'], priority: 'Medium',
  },
  {
    id: 33, customerName: 'Greg Fields', dateIn: '2025-05-03', dateOut: '2025-05-05',
    progress: 'Repair Done', repairNeeded: ['frame alignment'], partsNeeded: ['beams'], priority: 'Low',
  },
  {
    id: 34, customerName: 'Ella Rice', dateIn: '2025-05-04', dateOut: '2025-05-06',
    progress: 'Repair Done', repairNeeded: ['fender'], partsNeeded: ['bracket'], priority: 'High',
  },
  {
    id: 35, customerName: 'Dean Storm', dateIn: '2025-05-05', dateOut: '2025-05-07',
    progress: 'Repair Done', repairNeeded: ['door alignment'], partsNeeded: ['track'], priority: 'Medium',
  },
  {
    id: 36, customerName: 'Julie Barr', dateIn: '2025-05-06', dateOut: '2025-05-08',
    progress: 'Repair Done', repairNeeded: ['paint job'], partsNeeded: ['primer', 'paint'], priority: 'Low',
  },
];




const RightSideBar = ({selected}) => {

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

  const [selectedStatus, setSelectedStatus] = useState("All");

  const [services, setServices] = useState(tableData);

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
  
  const statuses = ["All", "New", "In progress", "Repair done", "Called", "Pending", "Completed"];
  

  const countByStatus = (status) => {
    if (status === "All") {
      return tableData.length; // For "All", return the total number of items
    }
    return tableData.filter(item => item.progress.toLowerCase() === status.toLowerCase()).length;
  };
  
  const filteredTable =
  selectedStatus === "All"
    ? tableData
    : tableData.filter(service => service.progress.toLowerCase() === selectedStatus.toLowerCase());


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
            {selected === 'Dashboard' && (
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
  {statuses.map((status) => (
    <div
      key={status}
      onClick={() => setSelectedStatus(status)}
      style={{ cursor: 'pointer' }}
    >
      <ProgressFilter
        title={status}
        count={countByStatus(status)}  // Get the count for each status
        bgColor={selectedStatus === status ? '#333' : '#f1f1f1'}
        color={selectedStatus === status ? '#fff' : '#000'}
      />
    </div>
  ))}
</div>
            
                <div className="rightsidebar-table">
                {viewMode === "table" ? (
                  <div className="order-table-container">
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
  {filteredTable.length === 0 ? (
    <tr>
      <td colSpan="8">No data available</td>
    </tr>
  ) : (
    filteredTable.map((item) => {
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
    })
  )}
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
        </div>
      ) : (
        <div className="order-table-container">
        <div className="gridview-container">
        {filteredTable.length === 0 ? (
          <div className="no-data-message">
            <p>No data available.</p>
          </div>
        ) : (
          <>
          
            <div className="grid-view">
              {filteredTable.map((item) => {
                const { color, bgColor, icon } = getPriorityStyles(item.priority);
                return (
                  <div
                    key={item.id}
                    className="custom-grid"
                    onClick={() => {
                      setSelectedItem(item);
                      handleShow1();
                    }}
                  >
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
                        Repairs:{' '}
                        {Array.isArray(item.repairNeeded)
                          ? item.repairNeeded.join(', ')
                          : item.repairNeeded}
                      </p>
                      <p>
                        Parts:{' '}
                        {Array.isArray(item.partsNeeded)
                          ? item.partsNeeded.join(', ')
                          : item.partsNeeded}
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
          </>
        )}
      </div>
      </div>
      
       
      )}
      
      </div>
               
            </div>
                
              ) }
              {selected === 'Order' && (
              <div className="rightsidebar-bottom">
               
                <Order />
   
            </div>
              )}
              
          

        </div>
        <Modal
  show={show}
  onHide={handleClose}
  backdrop="static"
  keyboard={false}
  centered
>
  <Modal.Header closeButton>
    <Modal.Title> <h3>Add New Task</h3> </Modal.Title>
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
        <option>In progress</option>
        <option>Repair done</option>
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
        <option>In progress</option>
        <option>Repair done</option>
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

