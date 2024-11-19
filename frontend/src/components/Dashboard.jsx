// src/components/Dashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SteestImage from '../assets/steest.PNG';
import SttImage from '../assets/stt.jpg';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Building2, CalendarPlus } from 'lucide-react';
import axios from 'axios';
import logo from "../assets/urslogo.png";


const Dashboard = () => {
    const navigate = useNavigate();
    const userDetails = {
        username: 'exampleUser',
        loggedInTime: new Date().toLocaleString(),
    };

    const [currentSlide, setCurrentSlide] = useState(0);
    const [date, setDate] = useState(new Date());
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedSidebar, setSelectedSidebar] = useState('New Booking');
    const [newSidebarSelection, setNewSidebarSelection] = useState('Dashboard Overview');
    const [eventData, setEventData] = useState({
        venue: '',
        name: '',
        organization: '',
        date: '',
        duration: '',
        document: null,
        poster: null,
    });

    const images = [SteestImage, SttImage];

    const nextSlide = useCallback(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % images.length);
    }, [images.length]);

    useEffect(() => {
        const timeout = setTimeout(nextSlide, 5000);
        return () => clearTimeout(timeout);
    }, [nextSlide]);

    const renderSidebarContent = () => {
        switch (selectedSidebar) {
            case 'New Booking':
                return <p>Form to create a new booking.</p>;
            case 'Scheduled Bookings':
                return <p>List of scheduled bookings.</p>;
            case 'Available Dates':
                return <p>Calendar with available dates for booking.</p>;
            case 'Events':
                return (
                    <div>
                        <p>Upcoming events information.</p>
                        <button style={styles.addEventButton} onClick={() => setModalOpen(true)}>
                            Add Event
                        </button>
                    </div>
                );
            case 'Report':
                return <p>Report generation and analysis.</p>;
            default:
                return null;
        }
    };

    const renderNewSidebarContent = () => {
        switch (newSidebarSelection) {
            case 'University Supreme Student Government':
                return <p>Dashboard overview and user summary.</p>;
            case 'COE Council':
                return <p>User settings and preferences.</p>;
            case 'Notifications':
                return <p>List of notifications for the user.</p>;
            default:
                return null;
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEventData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setEventData((prevData) => ({
            ...prevData,
            [name]: files[0],
        }));
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('venue', eventData.venue);
        formData.append('name', eventData.name);
        formData.append('organization', eventData.organization);
        formData.append('date', eventData.date);
        formData.append('duration', eventData.duration);
        formData.append('document', eventData.document);
        formData.append('poster', eventData.poster);
    
        try {
            const response = await axios.post('http://localhost:5000/api/events', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                alert('Event added successfully!');
                setModalOpen(false); // Close the modal after successful submission
            }
        } catch (error) {
            console.error("Error uploading the event:", error);
            alert('Failed to add event!');
        }
    };

    return (
        <div>
            <div style={styles.container}>
                <nav style={styles.navbar}>
                <div className={styles.logoContainer}>
                    <img src={logo} alt="Logo" className={styles.logo} />
                    <div className={styles.titleflex}>
                        <h1 className={styles.title}>
                             University of Rizal System - Antipolo Campus
                        </h1>
                        <h1 className={styles.subtitle}>Event Booking System</h1>
                    </div>
                </div>
                    <button style={styles.logoutButton} onClick={() => navigate('/')}>Logout</button>
                </nav>

                <div style={styles.content}>
                    <div style={styles.slideshow}>
                        <h2>Slideshow</h2>
                        <div style={styles.slideshowContainer}>
                            <button onClick={nextSlide} style={styles.navButton}>❮</button>
                            <img src={images[currentSlide]} alt="Slideshow" style={styles.slideshowImage} />
                            <button onClick={nextSlide} style={styles.navButton}>❯</button>
                        </div>
                    </div>
                    <div style={styles.calendar}>
                        <h2>Calendar</h2>
                        <Calendar onChange={setDate} value={date} minDate={new Date(2020, 0, 1)} />
                        <p style={{ marginTop: '20px' }}>Selected Date: {date.toDateString()}</p>
                    </div>
                </div>

                <hr style={styles.divider} />

                <div style={styles.venueBooklistContainer}>
                    <h2 style={styles.header}><CalendarPlus size={20} color="#063970" /> Venue Booklist</h2>
                    <div style={styles.sidebarContainer}>
                        <div style={styles.sidebarr}>
                            {['Events', 'Scheduled Bookings', 'Available Dates', 'Report'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setSelectedSidebar(item)}
                                    style={{
                                        ...styles.sidebarButton,
                                        backgroundColor: selectedSidebar === item ? '#0e4296' : 'transparent',
                                        color: selectedSidebar === item ? '#fff' : '#0e4296',
                                    }}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                        <div style={styles.sidebarContent}>
                            <h3>{selectedSidebar}</h3>
                            {renderSidebarContent()}
                        </div>
                    </div>
                </div>
                <hr style={styles.divider} />

                <div style={styles.newSidebarContainer}>
                    <h2 style={styles.header}><Building2 size={20} color="#063970" /> Councils and Organization List</h2>
                    <div style={styles.sidebarContainer}>
                        <div style={styles.sidebar}>
                            {['University Supreme Student Government', 'COE Council', 'COBA Council'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setNewSidebarSelection(item)}
                                    style={{
                                        ...styles.sidebarButton,
                                        backgroundColor: newSidebarSelection === item ? '#0e4296' : 'transparent',
                                        color: newSidebarSelection === item ? '#fff' : '#0e4296',
                                    }}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                        <div style={styles.sidebarContent}>
                            <h3>{newSidebarSelection}</h3>
                            {renderNewSidebarContent()}
                        </div>
                    </div>
                    <hr style={styles.divider} />
                </div>

                <div style={styles.VMC}>
                    <div style={styles.verticalLine}>
                        <h3 style={styles.header}>VISION</h3>
                        <p>The leading University in human resource development, knowledge and technology generation, and environmental stewardship.</p>
                        <h3 style={styles.header}>MISSION</h3>
                        <p>The University of Rizal System is committed to nurturing and producing upright and competent graduates and an empowered community through relevant and sustainable higher professional and technical instruction, research, extension, and production services.</p>
                        <h3 style={styles.header}>CORE VALUES</h3>
                        <p>R – Responsiveness</p>
                        <p>I – Integrity</p>
                        <p>S – Service</p>
                        <p>E – Excellence</p>
                        <p>S – Social Responsibility</p>
                    </div>
                </div>

                <hr style={styles.divider} />

                {isModalOpen && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modal}>
                            <h3>Add Event</h3>
                            <form onSubmit={handleModalSubmit} encType="multipart/form-data">
                                <div style={styles.formGroup}>
                                    <label>Venue:</label>
                                    <select 
                                        name="venue"
                                        value={eventData.venue}
                                        onChange={handleInputChange}
                                        required style={styles.input}
                                    >
                                        <option value="">Select Venue</option>
                                        <option value="Venue 1">Court</option>
                                        <option value="Venue 2">Room 101</option>
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label>Name:</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Event Name"
                                        value={eventData.name}
                                        onChange={handleInputChange}
                                        required style={styles.input}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label>Organization:</label>
                                    <select 
                                        name="organization"
                                        value={eventData.organization}
                                        onChange={handleInputChange}
                                        required style={styles.input}
                                    >
                                        <option value="">Select Organization</option>
                                        <option value="COE">COE</option>
                                        <option value="CBA">CBA</option>
                                    </select>
                                </div>
                                <div style={styles.formGroup}>
                                    <label>Date:</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={eventData.date}
                                        onChange={handleInputChange}
                                        required style={styles.input}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label>Duration:</label>
                                    <input
                                        type="text"
                                        name="duration"
                                        placeholder="Duration"
                                        value={eventData.duration}
                                        onChange={handleInputChange}
                                        required style={styles.input}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label>Document:</label>
                                    <input
                                        type="file"
                                        name="document"
                                        onChange={handleFileChange}
                                        required style={styles.input}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label>Poster:</label>
                                    <input
                                        type="file"
                                        name="poster"
                                        onChange={handleFileChange}
                                        required style={styles.input}
                                    />
                                </div>
                                <div style={styles.modalFooter}>
                                    <button type="submit" style={styles.submitButton}>Submit</button>
                                    <button onClick={() => setModalOpen(false)} style={styles.cancelButton}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#f9f9f9',
    },
    navbar: {
        backgroundColor: '#0e4296',
        color: '#fff',
        padding: '15px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontSize: '1.5em',
    },
    logoutButton: {
        padding: '10px 15px',
        backgroundColor: '#fff',
        color: '#0e4296',
        border: 'none',
        cursor: 'pointer',
    },
    content: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '20px',
    },
    slideshow: {
        width: '60%',
        textAlign: 'center',
    },
    slideshowContainer: {
        position: 'relative',
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#fff',
        fontSize: '2em',
        cursor: 'pointer',
    },
    slideshowImage: {
        width: '100%',
        height: 'auto',
    },
    calendar: {
        width: '35%',
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    divider: {
        margin: '20px 0',
        border: '1px solid #ccc',
    },
    venueBooklistContainer: {
        padding: '20px',
    },
    sidebarContainer: {
        display: 'flex',
    },
    sidebar: {
        width: '20%',
        padding: '10px',
        backgroundColor: '#e1e1e1',
        marginRight: '20px',
    },
    sidebarButton: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: '#f1f1f1',
        border: 'none',
        textAlign: 'left',
        cursor: 'pointer',
    },
    sidebarContent: {
        width: '70%',
    },
    header: {
        fontSize: '1.2em',
        marginBottom: '10px',
    },
    newSidebarContainer: {
        padding: '20px',
    },
    VMC: {
        padding: '20px',
    },
    verticalLine: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderLeft: '2px solid #0e4296',
        paddingLeft: '10px',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        width: '500px',
    },
    formGroup: {
        marginBottom: '10px',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginTop: '5px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    modalFooter: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    submitButton: {
        backgroundColor: '#0e4296',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
    },
    cancelButton: {
        backgroundColor: '#ccc',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
    },
};

export default Dashboard;